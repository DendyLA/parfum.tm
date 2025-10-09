from rest_framework.permissions import BasePermission

class IsWarehouseUser(BasePermission):
    """Разрешает изменение товаров только складу или администраторам"""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_staff  # админ
                or request.user.groups.filter(name="warehouse").exists()  # или склад
            )
        )
