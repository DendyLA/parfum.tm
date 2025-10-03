from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, VariationViewSet, PromotionViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("variations", VariationViewSet)
router.register("promotions", PromotionViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
