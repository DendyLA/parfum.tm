import nested_admin
from django.contrib import admin
from parler.admin import TranslatableAdmin
from django.utils.html import mark_safe
from .forms import ProductAdminForm
from django.utils.html import format_html

from .models import Category, Product, Promotion, Brand, ProductGallery, Order, OrderItem, ProductVariation, ProductVariationImage, VariationType


class ProductVariationImageInline(nested_admin.NestedTabularInline):
    model = ProductVariationImage
    extra = 2
    fields = ("image", "alt_text")

class ProductVariationInline(nested_admin.NestedStackedInline):
    model = ProductVariation
    extra = 1
    inlines = [ProductVariationImageInline]
    fields = ("variation_type", "value", "color_hex", "is_active")


class ProductGalleryInline(nested_admin.NestedTabularInline):
    model = ProductGallery
    extra = 3
    fields = ("image", "alt_text")



@admin.register(VariationType)
class VariationTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")
    prepopulated_fields = {"code": ("name",)}
    
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


# ------------------ Product ------------------
@admin.register(Product)
class ProductAdmin(nested_admin.NestedModelAdmin, TranslatableAdmin):
    inlines = [
        ProductGalleryInline,      # основная галерея
        ProductVariationInline,    # вариации + их галереи
    ]

    list_display = (
        "id",
        "barcode",
        "name",
        "price",
        "discount_price",
        "count",
        "image_preview",
    )

    search_fields = ("translations__name", "barcode")
    list_filter = ("category", "brand")
    readonly_fields = ("barcode", "created_at", "updated_at", "slug", "image_preview")
    list_editable = ("price", "discount_price")
    list_per_page = 10

    fieldsets = (
        ("Основная информация", {
            "fields": ("name", "description", "isRecommended")
        }),
        ("Цены и наличие", {
            "fields": ("price", "discount_price", "count")
        }),
        ("Категории и бренды", {
            "fields": ("brand", "category")
        }),
        ("Изображение товара", {
            "fields": ("image", "image_preview")
        }),
        ("Системные данные", {
            "classes": ("collapse",),
            "fields": ("barcode", "slug", "created_at", "updated_at")
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(
                f'<img src="{obj.image.url}" width="80" style="object-fit:cover;" />'
            )
        return "—"

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



class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

    readonly_fields = (
        "product",
        "product_name",
        "barcode",
        "variation",
        "quantity",
        "price",
        "product_image_preview",
    )

    def product_image_preview(self, obj):
        if obj.product_image:
            return format_html(
                '<img src="{}" style="max-height:80px;" />',
                obj.product_image.url
            )
        return "—"

    product_image_preview.short_description = "Фото товара"



@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "phone",
        "total_price",
        "created_at",
    )

    list_filter = ("created_at",)
    search_fields = ("phone", "first_name", "last_name")

    readonly_fields = (
        "first_name",
        "last_name",
        "phone",
        "comment",
        "total_price",
        "created_at",
    )

    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "variation",
        "quantity",
        "price",
        "order",
    )

    readonly_fields = (
        "order",
        "product",
        "product_name",
        "barcode",
        "variation",
        "quantity",
        "price",
        "product_image_preview",
    )

    def product_image_preview(self, obj):
        if obj.product_image:
            return format_html(
                '<img src="{}" style="max-height:80px;" />',
                obj.product_image.url
            )
        return "—"

    product_image_preview.short_description = "Фото товара"	