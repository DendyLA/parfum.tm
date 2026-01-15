from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProductViewSet, PromotionViewSet, BrandViewSet, ProductImportView, CategoryTreeView, GlobalSearchView, GlobalSearchFullView, CreateOrderView

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("promotions", PromotionViewSet)
router.register("brands", BrandViewSet)



urlpatterns = [
	path("products/search/", GlobalSearchView.as_view(), name='search-global'),
	path("products/search/full", GlobalSearchFullView.as_view(), name='search-full' ),

    path("", include(router.urls)),
	path("import-product/", ProductImportView.as_view(), name="import-product"),
	path('categories/<int:pk>/tree/', CategoryTreeView.as_view(), name='category-tree'),
	path("orders/create/", CreateOrderView.as_view(), name='order'),
]



