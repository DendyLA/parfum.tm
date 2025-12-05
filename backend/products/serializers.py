from rest_framework import serializers
from parler_rest.serializers import TranslatableModelSerializer, TranslatedFieldsField

from .models import Category, Product, Promotion, Brand, ProductGallery


class CategorySerializer(TranslatableModelSerializer):
	translations = TranslatedFieldsField(shared_model=Category)
	children = serializers.SerializerMethodField()
     
	def get_children(self, obj):
		# Возвращаем список дочерних категорий
		children = Category.objects.filter(parent=obj)
		return CategorySerializer(children, many=True).data

	class Meta:
		model = Category
		fields = ("id", "parent", "translations",  "slug", "children",)
		read_only_fields = ("id", "slug",)
          
		  


class CategoryTreeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "children"]

    def get_name(self, obj):
        # Получаем переведённое имя (любой язык, если нет текущего)
        return obj.safe_translation_getter("name", any_language=True)

    def get_children(self, obj):
        return CategoryTreeSerializer(obj.children.all(), many=True).data



class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = ("id", 'name', "logo", "slug",)
        read_only_fields = ("id", "slug",)


class ProductGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGallery
        fields = ["id", "image", "alt_text"]


class ProductSerializer(TranslatableModelSerializer):
	translations = TranslatedFieldsField(shared_model=Product)
	brand = BrandSerializer(read_only=True)
	category = CategorySerializer(read_only=True)
	gallery = ProductGallerySerializer(many=True, read_only=True)

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
            'gallery',
            'isRecommended',
		)
		read_only_fields = ("id", "created_at", "updated_at", "slug",)



class PromotionSerializer(TranslatableModelSerializer):
    translations = TranslatedFieldsField(shared_model=Promotion)

    class Meta:
        model = Promotion
        fields = ("id", "translations", "image", "active")
        read_only_fields = ("id",)

