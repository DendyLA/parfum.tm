from django.db import models
from parler.models import TranslatableModel, TranslatedFields

from ckeditor.fields import RichTextField

class Category(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=255, verbose_name="Имя категории")
    )
    
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="children", verbose_name="Подкатегория")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or 'No name'

class Brand(TranslatableModel):
    translations = TranslatedFields(
        name=models.CharField(max_length=255)
    )
    logo = models.ImageField(upload_to="brands/", null=True, blank=True)

    class Meta:
        verbose_name = "Бренд"
        verbose_name_plural = "Бренды"

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or 'No name'


class Product(TranslatableModel):
    barcode = models.CharField(max_length=255, unique=True, verbose_name="Бар код")  # уникальный с склада
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Бренд")

    translations = TranslatedFields(
        name=models.CharField(max_length=255, verbose_name="Имя товара"),
        description=RichTextField(blank=True, null=True, verbose_name="Описание товара"),
    )

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Категория")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Цена")
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Скидочная цена")  # акция
    image = models.ImageField(upload_to="products/", null=True, blank=True, verbose_name="Фото товара")
    count = models.PositiveIntegerField(default=0, verbose_name="Количество на складе")  # количество на складе
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания",null=True, blank=True,)
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления",null=True, blank=True,)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return self.safe_translation_getter("name", any_language=True) or 'No name'


class Variation(models.Model):
    #Разновидности товара: цвет, запах и т.д.
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variations", verbose_name="Товар")
    type = models.CharField(max_length=50, choices=[
        ("color", "Color"),
        ("scent", "Scent"),
    ], verbose_name="Разновидность")
    value = models.CharField(max_length=100, verbose_name="Тип")  # например "Красный", "Vanilla"
    stock = models.PositiveIntegerField(default=0, verbose_name="Количество")  # количество

    class Meta:
        verbose_name = "Разновидность"
        verbose_name_plural = "Разновидности"

    def __str__(self):
        return f"{self.product} - {self.value}" or 'No name'


class Promotion(TranslatableModel):
    """Акции/баннеры"""
    translations = TranslatedFields(
        title=models.CharField(max_length=255, verbose_name="Название акции"),
        description=RichTextField(blank=True, null=True, verbose_name="Описание акции"),
    )
    image = models.ImageField(upload_to="promotions/", null=True, blank=True, verbose_name="Фото акции")
    active = models.BooleanField(default=True, verbose_name="Активна ли акция?")

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or 'No name'


