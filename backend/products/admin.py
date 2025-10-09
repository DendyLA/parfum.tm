from django.contrib import admin
from parler.admin import TranslatableAdmin
from django.utils.html import format_html, mark_safe

from .models import Category, Product, Promotion, Brand


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    # Показываем поля в списке
    list_display = ( "name", "parent", "get_full_path")
    list_display_links = ("name", "parent",)
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
    list_display = ("name", "barcode", "price", "variations", "discount_price", 'image_preview', "count")
    list_display_links = ("name", "barcode",)
    list_filter = ("category",)
    search_fields = ("translations__name", "barcode",)
    readonly_fields = ("barcode", "created_at", "updated_at")
    list_editable = ("price", "discount_price", )


    fields = ("barcode", "name",  "price", "variations", "discount_price", "brand", "category", "image", "count", "description", 'created_at', 'updated_at', )

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="80" height="80" style="object-fit: cover;" />')
        return "Нет изображения"

    image_preview.short_description = "Превью"


@admin.register(Promotion)
class PromotionAdmin(TranslatableAdmin):
    list_display = ("title", "active")


@admin.register(Brand)
class BrandAdmin(TranslatableAdmin):
    list_display = ( "name", "logo")
