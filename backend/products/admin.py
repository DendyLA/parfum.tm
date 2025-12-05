import nested_admin
from django.contrib import admin
from parler.admin import TranslatableAdmin
from django.utils.html import mark_safe
from .forms import ProductAdminForm

from .models import Category, Product, Promotion, Brand, ProductGallery


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    list_display = ("name", "parent", "get_full_path")
    list_display_links = ("name", "parent")
    list_filter = ("parent",)
    search_fields = ("translations__name",)
    readonly_fields = ('slug',)
    fields = ('name', "parent", "slug")  # name редактируется через перевод
    list_per_page = 50

    def get_full_path(self, obj):
        path = [obj.name]
        parent = obj.parent
        while parent:
            path.insert(0, parent.name)
            parent = parent.parent
        return " > ".join(path)
    get_full_path.short_description = "Полный путь"


#-------------------GalleryProductInline-------------------
class ProductGalleryInline(admin.TabularInline):
	model = ProductGallery
	extra = 3  # сколько дополнительных фото добавить сразу
	fields = ['image', 'alt_text']
# ------------------ Product ------------------
@admin.register(Product)
class ProductAdmin(TranslatableAdmin):
    inlines = [ProductGalleryInline]
    form = ProductAdminForm
    list_display = ('id', "barcode", "name", "price", "variations", "discount_price", 'image_preview', "count")
    list_display_links = ("name", "barcode",)
    list_filter = ("category",)
    search_fields = ("translations__name", "barcode",)
    readonly_fields = ("barcode", "created_at", "updated_at", 'slug', 'image_preview',)
    list_editable = ("price", "discount_price", )
    list_per_page = 10

    fieldsets = (
        ("Основная информация", {
            "fields": ("name", "description", 'isRecommended')
        }),
        ("Цены и наличие", {
            "fields": ("price", "discount_price", "count")
        }),
        ("Категории и бренды", {
            "fields": ("brand", "category")
        }),
        ("Идентификаторы", {
            "fields": ("barcode", "slug")
        }),
        ("Изображения и вариации", {
            "fields": ("image", "variations", "image_preview")
        }),
        ("Системная информация", {
            "classes": ("collapse",),
            "fields": ("created_at", "updated_at")
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="80" height="80" style="object-fit: cover;" />')
        return "Нет изображения"

    image_preview.short_description = "Превью"


# ------------------ Promotion ------------------
@admin.register(Promotion)
class PromotionAdmin(TranslatableAdmin):
    list_display = ("title", "active")	
    list_editable = ("active",)	
    list_per_page = 10


# ------------------ Brand ------------------
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("name", "logo")
    readonly_fields = ('slug',)
    list_per_page = 10
