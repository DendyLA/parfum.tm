from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Category, Product, Variation, Promotion
from .serializers import CategorySerializer, ProductSerializer, VariationSerializer, PromotionSerializer


class CategoryViewSet(ModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer

	def get_permissions(self):
		if self.action in ["list", "retrieve"]:  # GET запросы
			return [AllowAny()]
		return [IsAuthenticated()]  # POST, PUT, DELETE

class ProductViewSet(ModelViewSet):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer

	def get_permissions(self):
		if self.action in ["list", "retrieve"]:  # GET запросы
			return [AllowAny()]
		return [IsAuthenticated()]  # POST, PUT, DELETE


class VariationViewSet(ModelViewSet):
	queryset = Variation.objects.all()
	serializer_class = VariationSerializer

	def get_permissions(self):
		if self.action in ["list", "retrieve"]:  # GET запросы
			return [AllowAny()]
		return [IsAuthenticated()]  # POST, PUT, DELETE


class PromotionViewSet(ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:  # GET запросы
            return [AllowAny()]
        return [IsAuthenticated()]  # POST, PUT, DELETE
