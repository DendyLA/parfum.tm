"""
URL configuration for parfum_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView


from rest_framework import permissions
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# --- DRF-YASG schema ---
schema_view = get_schema_view(
    openapi.Info(
        title="Parfum API",
        default_version='v1',
        description="Документация API для проекта Parfum",
        contact=openapi.Contact(email="contact@parfum.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],
)

swagger_schema_view = schema_view.with_ui('swagger', cache_timeout=0)




serviceurl = [
	path('admin/', admin.site.urls),
]

documentationurl = [
    # --- API documentation (отдельные, не в api/*) ---
    path('docs/swagger(<format>\.json|\.yaml)', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('docs/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('docs/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('docs/', RedirectView.as_view(url='/docs/swagger/', permanent=False)),
]

jwttokens = [
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

apiurl = [
	 # --- API versioning ---
    path('api/v1/', include('products.urls')),  # version 1
    # path('api/v2/', include('your_app.api.v2.urls')),  # version 2 (когда понадобится)
]


urlpatterns = serviceurl + documentationurl + jwttokens + apiurl



if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)