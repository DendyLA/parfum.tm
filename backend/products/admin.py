from django.contrib import admin
from parler.admin import TranslatableAdmin
from .models import Category, Product, Variation, Promotion, Brand


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    # Показываем поля в списке
    list_display = ( "name", "parent", "get_full_path")
    list_filter = ("parent",)
    search_fields = ("translations__name",)

    fields = ("name", "parent", )
    

    def get_full_path(self, obj):
        """Показывает полный путь категории, например: Косметика > Для губ > Помада"""
        path = [obj.name]
        parent = obj.parent
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent
        return " > ".join(path)
    get_full_path.short_description = "Полный путь"


@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    list_display = ("name", "barcode", "price", "discount_price")


@admin.register(Variation)
class VariationAdmin(admin.ModelAdmin):
    list_display = ("product", "type", "value", "stock")


@admin.register(Promotion)
class PromotionAdmin(TranslatableAdmin):
    list_display = ("title", "active")


@admin.register(Brand)
class BrandAdmin(TranslatableAdmin):
    list_display = ( "name", "logo")
