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
from .filters import ProductFilter
from django.db.models import Case, When, F, Value, IntegerField


from collections import defaultdict

from .models import Category, Product, Promotion, Brand
from .serializers import CategorySerializer, ProductSerializer, PromotionSerializer, BrandSerializer, CategoryTreeSerializer
from .permissions import IsWarehouseUser


class CategoryViewSet(ReadOnlyModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer
	permission_classes = [AllowAny]  # GET разрешен всем

	filter_backends = [DjangoFilterBackend]
	filterset_fields = ['id', 'slug']  # <-- фильтр по slug
    
	
class CategoryTreeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        category = Category.objects.get(pk=pk)
        data = CategoryTreeSerializer(category).data
        return Response(data)

   

class ProductViewSet(ModelViewSet):
	queryset = Product.objects.annotate(
		real_price=Case(
			When(discount_price__isnull=False, then=F('discount_price')),
			default=F('price')
		),
		in_stock_order=Case(
			When(count__gt=0, then=Value(1)),
			default=Value(0),
			output_field=IntegerField()
		)
	)
	serializer_class = ProductSerializer
	filter_backends = [DjangoFilterBackend, OrderingFilter]
	lookup_field = 'slug'	
	filterset_class = ProductFilter

    # Разрешённые сортировки
	ordering_fields = [
		'price',
		'discount_price',
		'created_at',
		'real_price',  # умная цена
		'in_stock_order',
	]

	ordering = ['-in_stock_order', '-created_at']  # по умолчанию — новые товары
     
	 

	def get_permissions(self):
		if self.action in ["list", "retrieve"]:
			return [AllowAny()]
		return [IsWarehouseUser()]


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
	lookup_field = 'slug'

class ProductImportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        barcode = data.get("barcode")
        name = data.get("name")
        count = data.get("count")
        price = data.get("price")
        discount_price = data.get("discount_price")

        if not barcode or not name or count is None or price is None:
            return Response(
                {"error": "Поля barcode, name, count и price обязательны"},
                status=400
            )


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