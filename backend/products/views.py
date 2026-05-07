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
from django.shortcuts import get_object_or_404
from rest_framework.generics import GenericAPIView

from .models import Category, Product, Promotion, Brand, Order, OrderItem, ProductVariation
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
		queryset = Product.objects.all().order_by('id')   
			   
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


from django.utils.text import slugify
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
class ProductImportView(APIView):
    """
    Принимает массив товаров от склада в формате:
    {
      "rows": [
        {
          "goods_id": "...",
          "count_goods": "...",
          "price": "...",
          "discount_price": "...",
          "code": "...",
          "name": "...",
          "barcode": "..."
        },
        ...
      ]
    }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        rows = data.get("rows")
        if not rows or not isinstance(rows, list):
            return Response({"error": "Ожидается поле 'rows' с массивом товаров"}, status=400)

        results = []

        for item in rows:
            barcode = item.get("barcode") or item.get("code")  # если barcode пустой, можно использовать code
            name = item.get("name")
            count_goods = item.get("count_goods")
            price = item.get("price")
            discount_price = item.get("discount_price")

            # Приводим числа к правильному типу
            try:
                count_goods = int(count_goods)
                price = float(str(price).replace(",", "."))
                if discount_price is not None:
                    discount_price = float(str(discount_price).replace(",", "."))
            except (ValueError, TypeError):
                results.append({"barcode": barcode, "error": "Неправильный формат числовых полей"})
                continue
            

            if discount_price in (0, price):
                discount_price = None
                    
            if not barcode or not name or count_goods is None or price is None:
                results.append({"barcode": barcode, "error": "Поля barcode, name, count_goods и price обязательны"})
                continue

            # name = name[:50]

            try:
                product = Product.objects.get(barcode=barcode)
                product.set_current_language("ru")
                updated = False

                if product.safe_translation_getter("name") != name:
                    product.name = name
                    updated = True
                if product.count != count_goods:
                    product.count = count_goods
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

                if updated:
                    base_slug = slugify(product.name)[:45]
                    slug = base_slug
                    counter = 1
                    while Product.objects.filter(slug=slug).exclude(pk=product.pk).exists():
                        slug = f"{base_slug}-{counter}"
                        counter += 1
                    product.slug = slug
                    product.save()

                results.append({"barcode": barcode, "created": False, "product_id": product.id})

            except Product.DoesNotExist:
                product = Product(
                    barcode=barcode,
                    count=count_goods,
                    price=price,
                    discount_price=discount_price
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

                results.append({"barcode": barcode, "created": True, "product_id": product.id})

        return Response({"results": results}, status=200)


from django.contrib.postgres.search import TrigramSimilarity, TrigramWordSimilarity
from django.db.models import Q, Max
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = (request.GET.get("q") or request.GET.get("search") or "").strip()
        limit = int(request.GET.get("limit", 3))
        if not query:
            return Response({"products": [], "categories": [], "brands": []})

        words = query.lower().split()
        first_word = words[0]  # "hgo" → ищем по первому слову тоже

        # ========================
        #   ПРОДУКТЫ
        # ========================
        products_qs = Product.objects.language(None)

        # 1️⃣ Точные совпадения (icontains по любому слову)
        q_exact = Q()
        for word in words:
            q_exact |= Q(translations__name__icontains=word)
        exact_products = products_qs.filter(q_exact).distinct()

        # 2️⃣ Триграм по полному запросу
        if not exact_products.exists():
            exact_products = products_qs.annotate(
                similarity=TrigramSimilarity('translations__name', query)
            ).filter(similarity__gt=0.15).order_by('-similarity')

        # 3️⃣ Fuzzy по первому слову — ловит "hgo" → "hugo"
        if not exact_products.exists():
            exact_products = products_qs.annotate(
                similarity=TrigramWordSimilarity(first_word, 'translations__name')
            ).filter(similarity__gt=0.3).order_by('-similarity')

        exact_products = exact_products[:limit]

        # ========================
        #   БРЕНДЫ
        # ========================
        brands_qs = Brand.objects.all()

        q_brand_exact = Q()
        for word in words:
            q_brand_exact |= Q(name__icontains=word)
        exact_brands = brands_qs.filter(q_brand_exact).distinct()

        if not exact_brands.exists():
            exact_brands = brands_qs.annotate(
                similarity=TrigramSimilarity('name', query)
            ).filter(similarity__gt=0.15).order_by('-similarity')

        # Fuzzy по первому слову
        if not exact_brands.exists():
            exact_brands = brands_qs.annotate(
                similarity=TrigramWordSimilarity(first_word, 'name')
            ).filter(similarity__gt=0.3).order_by('-similarity')

        exact_brands = exact_brands[:limit]

        # ========================
        #   КАТЕГОРИИ
        # ========================
        categories_qs = Category.objects.annotate(
            similarity=TrigramSimilarity('translations__name', query)
        ).filter(similarity__gt=0.15).order_by('-similarity')

        # Fuzzy fallback для категорий
        if not categories_qs.exists():
            categories_qs = Category.objects.annotate(
                similarity=TrigramWordSimilarity(first_word, 'translations__name')
            ).filter(similarity__gt=0.3).order_by('-similarity')

        parents = categories_qs.filter(parent__isnull=True)
        if not parents.exists():
            parents = Category.objects.filter(id__in=categories_qs.values("parent"))

        children = Category.objects.filter(parent__in=parents)
        categories_final = []
        for parent in parents[:limit]:
            parent_children = children.filter(parent=parent)[:limit]
            parent_data = CategorySerializer(parent).data
            parent_data["children"] = CategorySerializer(parent_children, many=True).data
            categories_final.append(parent_data)

        return Response({
            "products": ProductSerializer(exact_products, many=True, context={"request": request}).data,
            "categories": categories_final,
            "brands": BrandSerializer(exact_brands, many=True, context={"request": request}).data,
        })

class GlobalSearchFullView(APIView):
    """
    Полный поиск с поддержкой триграмм и более точного релевантного порядка.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("q") or request.GET.get("search", "")
        query = query.strip()
        lang = request.GET.get("lang", "ru")
        limit = int(request.GET.get("limit", 10))

        if not query:
            return Response({"products": [], "categories": [], "brands": []})

        # --- Категории ---
        categories = Category.objects.language(lang).annotate(
            similarity=TrigramSimilarity(f"translations__{lang}__name", query)
        ).annotate(
            relevance=F("similarity")
        ).filter(
            Q(translations__name__icontains=query) | Q(similarity__gt=0.05)
        ).distinct().order_by("-relevance")[:limit]

        # --- Бренды ---
        brands = Brand.objects.annotate(
            similarity=TrigramSimilarity("name", query)
        ).annotate(
            relevance=F("similarity")
        ).filter(
            Q(name__icontains=query) | Q(similarity__gt=0.05)
        ).order_by("-relevance")[:limit]

        # --- Товары ---
        products = Product.objects.language(lang).annotate(
            similarity=TrigramSimilarity(f"translations__{lang}__name", query)
        ).annotate(
            relevance=F("similarity")
        ).filter(
            Q(translations__name__icontains=query) |
            Q(slug__icontains=query) |
            Q(similarity__gt=0.05)
        ).distinct().order_by("-relevance")[:limit]

        return Response({
            "products": ProductSerializer(products, many=True).data,
            "categories": CategorySerializer(categories, many=True).data,
            "brands": BrandSerializer(brands, many=True).data,
        })
    
	

class CreateOrderView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = OrderCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.create(
            first_name=data["first_name"],
            phone=data["phone"],
            address=data["address"],
            comment=data.get("comment", ""),
            total_price=data["total_price"],
        )

        for item in data["items"]:
            product = get_object_or_404(Product, id=item["product_id"])

            variation = None
            if item.get("variation_id"):
                variation = get_object_or_404(
                    ProductVariation,
                    id=item["variation_id"],
                    product=product
                )

            price = product.discount_price or product.price  # ✅ ВАЖНО

            OrderItem.objects.create(
                order=order,
                product=product,
                variation=variation,
                product_name=product.safe_translation_getter(
                    "name", any_language=True
                ),
                product_image=product.image,
                barcode=product.barcode,
                quantity=item["quantity"],
                price=price,
            )

        return Response(
            {"success": True, "order_id": order.id},
            status=status.HTTP_201_CREATED
        )