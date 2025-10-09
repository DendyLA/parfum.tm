from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProductViewSet, PromotionViewSet, BrandViewSet, ProductImportView

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("promotions", PromotionViewSet)
router.register("brands", BrandViewSet)



urlpatterns = [
    path("", include(router.urls)),
	path("import-product/", ProductImportView.as_view(), name="import-product"),
]



