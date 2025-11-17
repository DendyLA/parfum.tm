from django.db import models
from parler.models import TranslatableModel, TranslatedFields
from slugify import slugify
from django.core.exceptions import ValidationError


from ckeditor.fields import RichTextField

class Category(TranslatableModel):
	translations = TranslatedFields(
		name=models.CharField(max_length=255, verbose_name="Имя категории", help_text="Например: Косметика, Для губ, Помада")
	)

	parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="children", verbose_name="Родительская Категория", help_text="Если категория верхнего уровня, оставьте поле пустым")
	slug = models.SlugField(unique=True, blank=True, null=True, verbose_name="Слаг (URL)", help_text="Оставьте это поле пустым!! Оно будет создано автоматически из имени категории")

	class Meta:
		verbose_name = "Категория"
		verbose_name_plural = "Категории"
		
	def clean(self):
		"""
		Проверяем, чтобы не было циклов в дереве категорий
		"""
		parent = self.parent
		while parent:
			if parent == self:
				raise ValidationError("Нельзя сделать категорию родителем самой себя или её потомка!")
			parent = parent.parent

	def save(self, *args, **kwargs):
		# Вызов проверки циклов
		self.full_clean()

		# Генерация уникального slug
		if not self.slug:
			base_slug =  slugify(self.safe_translation_getter("name", any_language=True) or "")
			slug = base_slug
			counter = 1
			while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
				slug = f"{base_slug}-{counter}"
				counter += 1
			self.slug = slug

		super().save(*args, **kwargs)	
        

	def __str__(self):
		return self.safe_translation_getter("name", any_language=True) or 'No name'



class Brand(models.Model):
    name = models.CharField(
        max_length=255,
        help_text="Например: Chanel, Dior, Gucci",
        verbose_name="Имя бренда"
    )

    logo = models.ImageField(
        upload_to="brands/%Y/%m/%d/",
        null=True,
        blank=True,
        help_text="Логотип бренда",
        verbose_name="Логотип бренда"
    )

    slug = models.SlugField(
        unique=False,
        blank=True,
        null=True,
        verbose_name="Слаг (URL)",
        help_text="Оставьте это поле пустым!! Оно будет создано автоматически из имени бренда"
    )

    class Meta:
        verbose_name = "Бренд"
        verbose_name_plural = "Бренды"

    def save(self, *args, **kwargs):
        if not self.slug:
            # создаём slug из name
            self.slug = slugify(self.name or "")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name or "No name"



class Product(TranslatableModel):
	barcode = models.CharField(max_length=255, unique=True, verbose_name="Бар код", help_text='Бар код с склада')  # уникальный с склада


	translations = TranslatedFields(
		name=models.CharField(max_length=255, verbose_name="Имя товара", help_text="Например: Помада Rouge Allure (получаю с склада)"),
		description=RichTextField(blank=True, null=True, verbose_name="Описание товара", help_text="Опишите тоар, его особенности, состав"),
	)

	category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Категория", help_text="Выберите категорию товара")
	brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Бренд", help_text="Выберите бренд товара")
	price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Цена", help_text="Напишите Цену без скидки")
	discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Скидочная цена", help_text='Напишите Скидочную цену')  # акция
	image = models.ImageField(upload_to="products/%Y/%m/%d/", null=True, blank=True, verbose_name="Фото товара", help_text="Выберите Фото товара")
	count = models.PositiveIntegerField(default=0, verbose_name="Количество на складе", help_text='Колчиество товаров с склада')  # количество на складе
	variations = models.JSONField(default=dict, blank=True, help_text='Например: в таком формате {"цвет": "красный", "объем": "50мл"}', verbose_name="Вариации товара")  # цвет, объем и т.д.
	created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания",null=True, blank=True,)
	updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления",null=True, blank=True,)
	slug = models.SlugField(unique=True, blank=True, null=True, verbose_name="Слаг (URL)", help_text="Оставьте это поле пустым!! Оно будет создано автоматически из имени товара")

	class Meta:
		verbose_name = "Товар"
		verbose_name_plural = "Товары"




	def save(self, *args, **kwargs):
        # Если нет pk, сначала сохраняем, чтобы был pk
		if not self.pk:
			super().save(*args, **kwargs)

		# Генерация уникального slug
		if not self.slug:
			base_slug = slugify(self.safe_translation_getter("name", any_language=True) or "")
			slug = base_slug
			counter = 1
			while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
				slug = f"{base_slug}-{counter}"
				counter += 1
			self.slug = slug

		super().save(*args, **kwargs)
	

	def __str__(self):
		return self.safe_translation_getter("name", any_language=True) or 'No name'




class Promotion(TranslatableModel):
    """Акции/баннеры"""
    translations = TranslatedFields(
        title=models.CharField(max_length=255, verbose_name="Название акции", help_text="Например: Летняя распродажа"),
        description=RichTextField(blank=True, null=True, verbose_name="Описание акции", help_text="Опишите акцию, условия"),
    )
    image = models.ImageField(upload_to="promotions/%Y/%m/%d/", null=True, blank=True, verbose_name="Фото акции", help_text="Выберите Фото акции/баннера")
    active = models.BooleanField(default=True, verbose_name="Активна ли акция?", help_text="Если акция не активна, она не будет отображаться на сайте")

    class Meta:
        verbose_name = "Акция"
        verbose_name_plural = "Акции"

    def __str__(self):
        return self.safe_translation_getter("title", any_language=True) or 'No name'


