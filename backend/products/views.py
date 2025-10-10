from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated


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

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:  # только просмотр
            return [AllowAny()]
        return [IsWarehouseUser()]  # изменения — только складу


class PromotionViewSet(ReadOnlyModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [AllowAny]


class BrandViewSet(ReadOnlyModelViewSet):
	queryset = Brand.objects.all()
	serializer_class = BrandSerializer
	permission_classes = [AllowAny]


class ProductImportView(APIView):
    permission_classes = [IsAuthenticated, IsWarehouseUser]

    def post(self, request):
        data = request.data
        barcode = data.get("barcode")
        name = data.get("name")
        count = data.get("count")
        price = data.get("price")  # получаем цену со склада

        if not barcode or not name or count is None or price is None:
            return Response(
                {"error": "Поля barcode, name, count и price обязательны"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(barcode=barcode)
            # обновляем существующий товар
            updated = False
            product.set_current_language("ru")

            if product.safe_translation_getter("name") != name:
                product.name = name
                updated = True

            if product.count != count:
                product.count = count
                updated = True

            if product.price != price:
                product.price = price
                updated = True

            if updated:
                product.save()
            created = False
        except Product.DoesNotExist:
            # создаём новый товар
            product = Product.objects.create(
                barcode=barcode,
                count=count,
                price=price,
            )
            product.set_current_language("ru")
            product.name = name
            product.save()
            created = True

        return Response(
            {"success": True, "created": created, "product_id": product.id},
            status=status.HTTP_200_OK
        )