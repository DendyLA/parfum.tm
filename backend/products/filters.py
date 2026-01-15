from django_filters import rest_framework as filters
from .models import Product
from django_filters.rest_framework import FilterSet, OrderingFilter
from django.db.models import Case, When, F, DecimalField

class ProductFilter(filters.FilterSet):
	min_price = filters.NumberFilter(method='filter_min_price')
	max_price = filters.NumberFilter(method='filter_max_price')
	has_discount = filters.BooleanFilter(method='filter_has_discount')
	is_recommended = filters.BooleanFilter(field_name='isRecommended')
	in_stock = filters.BooleanFilter(method='filter_in_stock')


	class Meta:
		model = Product
		fields = ['category', 'brand',]

	# Аннотируем "эффективную цену" для фильтрации
	def annotate_effective_price(self, queryset):
		return queryset.annotate(
			effective_price=Case(
				When(discount_price__isnull=False, then=F('discount_price')),
				default=F('price'),
				output_field=DecimalField(max_digits=10, decimal_places=2)  # те же значения
			)
		)



	def filter_min_price(self, queryset, name, value):
		queryset = self.annotate_effective_price(queryset)
		return queryset.filter(effective_price__gte=value)

	def filter_max_price(self, queryset, name, value):
		queryset = self.annotate_effective_price(queryset)
		return queryset.filter(effective_price__lte=value)

	def filter_has_discount(self, queryset, name, value):
		if value:
			return queryset.filter(discount_price__isnull=False)
		return queryset
	def filter_in_stock(self, queryset, name, value):
		if value:
			return queryset.filter(count__gt=0)   # товары в наличии
		else:
			return queryset.filter(count__lte=0)  # товары нет в наличии