from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from .models import Category, Product, Variation, Promotion, Brand


class CategorySerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Category)

    class Meta:
        model = Category
        fields = ("id", "translations", "parent")


class BrandSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Brand)

    class Meta:
        model = Brand
        fields = ("id", "translations", "logo")


class VariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variation
        fields = ("id", "type", "value", "stock")


class ProductSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Product)
    variations = VariationSerializer(many=True, read_only=True)
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
        )


class PromotionSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Promotion)

    class Meta:
        model = Promotion
        fields = ("id", "translations", "image", "active")
