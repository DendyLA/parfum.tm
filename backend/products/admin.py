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

def variations_list(self, obj):
	variations = obj.variations.all()
	if not variations:
		return "—"
	html = []
	for v in variations:
		color = f' <span style="display:inline-block;width:15px;height:15px;background:{v.color_hex};border:1px solid #000;margin-left:5px;"></span>' if v.color_hex else ""
		html.append(f"{v.variation_type.name}: {v.value}{color}")
	return mark_safe("<br>".join(html))
	
variations_list.short_description = "Вариации"


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
        "isOnSale",
        "count",
        "image_preview",
        "variations_list",
    )

    search_fields = ("translations__name", "barcode")
    list_filter = ("category", "brand", "isOnSale")
    readonly_fields = ("barcode", "created_at", "updated_at", "slug", "image_preview")
    list_editable = ("price", "discount_price", "isOnSale")
    list_per_page = 10

    fieldsets = (
        ("Основная информация", {
            "fields": ("name", "description", "isRecommended")
        }),
        ("Цены и наличие", {
            "fields": ("price", "discount_price", "count", "isOnSale",)
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
    # Новое поле для отображения вариаций
    def variations_list(self, obj):
        variations = obj.variations.all()
        if not variations:
            return "—"
        html = []
        for v in variations:
            color = f' <span style="display:inline-block;width:15px;height:15px;background:{v.color_hex};border:1px solid #000;margin-left:5px;"></span>' if v.color_hex else ""
            html.append(f"{v.variation_type.name}: {v.value}{color}")
        return mark_safe("<br>".join(html))
    variations_list.short_description = "Вариации"


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
        "product_image_preview",
        "product",
        "product_name",
        "barcode",
        "variation_display",
        "quantity",
        "price",
    )

    def product_image_preview(self, obj):
        if obj.product and obj.product.image:
            return format_html('<img src="{}" style="max-height:80px;" />', obj.product.image.url)
        return "—"
    
    def variation_display(self, obj):
        if obj.variation:
            return f"{obj.variation.variation_type.name}: {obj.variation.value}"
        return "—"
    
    variation_display.short_description = "Вариация"



# Регистрация в админке
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "phone",
        "address",
        "total_price",
        "created_at",
    )

    list_filter = ("created_at",)
    search_fields = ("phone", "first_name", "address")

    readonly_fields = (
        "first_name",
        "phone",
        "address",
        "comment",
        "total_price",
        "created_at",
    )

    inlines = [OrderItemInline]
    
	
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "product_name",
        "variation_display",      # <-- используем метод вместо поля variation
        "variation_color_display", # <-- показываем цвет
        "quantity",
        "price",
        "order",
    )

    readonly_fields = (
        "order",
        "product",
        "product_name",
        "barcode",
        "variation_display",      # <-- метод вместо поля
        "variation_color_display",# <-- метод
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

    def variation_display(self, obj):
        if obj.variation:
            return f"{obj.variation.variation_type.name}: {obj.variation.value}"
        return "—"
    variation_display.short_description = "Вариация"

    def variation_color_display(self, obj):
        if obj.variation and obj.variation.color_hex:
            return format_html(
                '<span style="display:inline-block;width:20px;height:20px;background:{};border:1px solid #000;"></span>',
                obj.variation.color_hex
            )
        return "—"
    variation_color_display.short_description = "Цвет"
