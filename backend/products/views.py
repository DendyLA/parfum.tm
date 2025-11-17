from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from slugify import slugify
import json
from django.utils.translation import gettext_lazy as _

from collections import defaultdict

from .models import Category, Product, Promotion, Brand
from .serializers import CategorySerializer, ProductSerializer, PromotionSerializer, BrandSerializer
from .permissions import IsWarehouseUser


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # GET разрешен всем


class ProductViewSet(ModelViewSet):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	filter_backends = [DjangoFilterBackend, OrderingFilter]
	filterset_fields = {
		'category': ['exact'],
		'discount_price': ['isnull'],  # добавляем lookup
	}
     
	ordering_fields = ['created_at']

	ordering = ['-created_at']

	def get_permissions(self):
		if self.action in ["list", "retrieve"]:  # только просмотр
			return [AllowAny()]
		return [IsWarehouseUser()]  # изменения — только складу


class PromotionViewSet(ReadOnlyModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [AllowAny]
     # Добавляем фильтры
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = {
        'active': ['exact'],  # фильтр по полю active
    }


class BrandViewSet(ReadOnlyModelViewSet):
	queryset = Brand.objects.all()
	serializer_class = BrandSerializer
	permission_classes = [AllowAny]


class ProductImportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        barcode = data.get("barcode")
        name = data.get("name")
        count = data.get("count")
        price = data.get("price")
        discount_price = data.get("discount_price")
        variations = data.get("variations", {})

        if not barcode or not name or count is None or price is None:
            return Response(
                {"error": "Поля barcode, name, count и price обязательны"},
                status=400
            )

        # Если variations пришли как JSON-строка
        if isinstance(variations, str):
            try:
                variations = json.loads(variations)
            except json.JSONDecodeError:
                return Response({"error": "Неверный формат поля variations"}, status=400)

        # Обрезаем name чтобы не превышал лимит в базе
        name = name[:50]

        try:
            product = Product.objects.get(barcode=barcode)
            product.set_current_language("ru")
            updated = False

            # Обновляем простые поля
            if product.safe_translation_getter("name") != name:
                product.name = name
                updated = True
            if product.count != count:
                product.count = count
                updated = True
            if product.price != price:
                product.price = price
                updated = True
            if discount_price is not None and product.discount_price != discount_price:
                product.discount_price = discount_price
                updated = True
            elif discount_price is None and product.discount_price is not None:
                product.discount_price = None
                updated = True

            # Объединяем вариации
            if variations:
                current_variations = product.variations or {}
                merged_variations = defaultdict(list)

                for key, value in current_variations.items():
                    if isinstance(value, list):
                        merged_variations[key].extend(value)
                    else:
                        merged_variations[key].append(value)

                for key, value in variations.items():
                    if isinstance(value, list):
                        merged_variations[key].extend([v for v in value if v not in merged_variations[key]])
                    else:
                        if value not in merged_variations[key]:
                            merged_variations[key].append(value)

                # Преобразуем обратно в обычный dict
                final_variations = {}
                for key, values in merged_variations.items():
                    final_variations[key] = values if len(values) > 1 else values[0]

                if product.variations != final_variations:
                    product.variations = final_variations
                    updated = True

            # Обновляем slug если есть изменения
            if updated:
                base_slug = slugify(product.name)[:45]  # оставляем место для -1, -2
                slug = base_slug
                counter = 1
                while Product.objects.filter(slug=slug).exclude(pk=product.pk).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                product.slug = slug
                product.save()

            created = False

        except Product.DoesNotExist:
            # Новый товар
            product = Product(
                barcode=barcode,
                count=count,
                price=price,
                discount_price=discount_price,
                variations=variations
            )
            product.save()

            product.set_current_language("ru")
            product.name = name

            base_slug = slugify(name)[:45]
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=product.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            product.slug = slug
            product.save()

            created = True

        return Response(
            {"success": True, "created": created, "product_id": product.id},
            status=200
        )