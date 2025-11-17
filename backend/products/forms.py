from django import forms
from parler.forms import TranslatableModelForm
from parler.utils.context import switch_language
from .models import Product, Category


class ProductAdminForm(TranslatableModelForm):
    category = forms.ModelChoiceField(
        queryset=Category.objects.all(),
        required=False
    )

    class Meta:
        model = Product
        fields = '__all__'  # теперь OK, т.к. форма парлеровская

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # строим вложенный список категорий
        def build_choices(categories, prefix=""):
            choices = []
            for cat in categories:
                with switch_language(cat, 'ru'):
                    choices.append((cat.pk, f"{prefix}{cat.name}"))
                if cat.children.exists():
                    choices += build_choices(cat.children.all(), prefix + "— ")
            return choices

        top = Category.objects.filter(parent__isnull=True)
        self.fields['category'].choices = build_choices(top)
