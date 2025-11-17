from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from .models import Category, Product, Promotion, Brand


class CategorySerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Category)

    class Meta:
        model = Category
        fields = ("id", "translations", "parent", "slug",)
        read_only_fields = ("id", "slug",)


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ("id", 'name', "logo", "slug",)
        read_only_fields = ("id", "slug",)




class ProductSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product)
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "barcode",
            "translations",
            "brand",
            "category",
            "price",
            "discount_price",
            "image",
            "count",
            "variations",
            "created_at",
            "updated_at",
            "slug",
        )
        read_only_fields = ("id", "created_at", "updated_at", "slug",)


class PromotionSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Promotion)

    class Meta:
        model = Promotion
        fields = ("id", "translations", "image", "active")
        read_only_fields = ("id",)
