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
from django.db.models import Case, When, F, Value, IntegerField, Q, DecimalField
from django.contrib.postgres.search import TrigramSimilarity
from rest_framework.decorators import api_view
from collections import defaultdict

from .models import Category, Product, Promotion, Brand, Order, OrderItem
from .serializers import CategorySerializer, ProductSerializer, PromotionSerializer, BrandSerializer, CategoryTreeSerializer, OrderCreateSerializer
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

	ordering = ['-in_stock_order', 'created_at']  # по умолчанию — старые товары
     
	def get_queryset(self):
		queryset = Product.objects.all()
		
		queryset = queryset.annotate(
			real_price=Case(
				When(discount_price__isnull=False, then=F('discount_price')),
				default=F('price'),
				output_field=DecimalField(max_digits=10, decimal_places=2)  # подставь реальные значения из модели!
			),
			in_stock_order=Case(
				When(count__gt=0, then=Value(1)),
				default=Value(0),
				output_field=IntegerField()
			)
		)
		return queryset
	 

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
    

from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Q

class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("q") or request.GET.get("search", "")
        query = query.strip()
        limit = int(request.GET.get("limit", 3))

        if not query:
            return Response({"products": [], "categories": [], "brands": []})

        # ========================
        #   ПОИСК КАТЕГОРИЙ с Trigram
        # ========================
        categories = Category.objects.annotate(
            similarity=TrigramSimilarity('translations__name', query)
        ).filter(similarity__gt=0.05).order_by('-similarity')

        # находим родителей
        parents = categories.filter(parent__isnull=True)

        # если совпал только child — поднимаем parent
        if not parents.exists():
            parents = Category.objects.filter(id__in=categories.values("parent"))

        # дети всех найденных родителей
        children = Category.objects.filter(parent__in=parents)

        # формируем структуру: вложенные дети
        categories_final = []
        for parent in parents[:limit]:
            parent_children = children.filter(parent=parent)[:limit]  # ограничим дочерние
            parent_data = CategorySerializer(parent).data
            parent_data["children"] = CategorySerializer(parent_children, many=True).data
            categories_final.append(parent_data)

        # ========================
        #   ПОИСК БРЕНДОВ
        # ========================
        brands = Brand.objects.annotate(
            similarity=TrigramSimilarity("name", query)
        ).filter(
            Q(similarity__gt=0.05) |
            Q(name__icontains=query)
        ).order_by("-similarity")[:limit]

        # ========================
        #   ПОИСК ПРОДУКТОВ
        # ========================
        products = Product.objects.language(None).annotate(
            similarity=TrigramSimilarity('translations__name', query)
        ).filter(
            Q(similarity__gt=0.05) |
            Q(translations__name__icontains=query) |
            Q(slug__icontains=query)
        ).distinct()[:limit]

        return Response({
			"products": ProductSerializer(
				products,
				many=True,
				context={"request": request}
			).data,

			"categories": categories_final,

			"brands": BrandSerializer(
				brands,
				many=True,
				context={"request": request}
			).data,
		})



class GlobalSearchFullView(APIView):
    """
    Полный поиск без ограничения
    """
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get("q") or request.GET.get("search", "")
        query = query.strip()


        if not query:
            return Response({
                "products": [],
                "categories": [],
                "brands": [],
            })

        # Категории
        categories = Category.objects.annotate(
			similarity=TrigramSimilarity("translations__name", query)
			).filter(
			Q(similarity__gt=0.05) | Q(translations__name__icontains=query)
			).distinct().order_by("-similarity")

        # Бренды
        brands = Brand.objects.annotate(
			similarity=TrigramSimilarity("name", query)
			).filter(
			Q(similarity__gt=0.05) | Q(name__icontains=query)
			).order_by("-similarity")

        # Товары
        products = Product.objects.language(None).annotate(
			similarity=TrigramSimilarity("translations__name", query)
			).filter(
			Q(similarity__gt=0.05) | Q(translations__name__icontains=query) | Q(slug__icontains=query)
			).distinct().order_by("-similarity")

        return Response({
            "products": ProductSerializer(products, many=True).data,
            "categories": CategorySerializer(categories, many=True).data,
            "brands": BrandSerializer(brands, many=True).data,
        })




class CreateOrderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.create(
            first_name=data["first_name"],
            last_name=data["last_name"],
            phone=data["phone"],
            comment=data.get("comment"),
            total_price=data["total_price"],
        )

        for item in data["items"]:
            product = Product.objects.get(id=item["product_id"])

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.safe_translation_getter("name", any_language=True),
                product_image=product.image,
                barcode=product.barcode,
                variation=item.get("variation"),
                quantity=item["quantity"],
                price=product.discount_price or product.price
            )

        return Response(
            {"success": True, "order_id": order.id},
            status=status.HTTP_201_CREATED
        )