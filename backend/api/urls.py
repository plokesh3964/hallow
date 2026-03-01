from django.urls import path
from . import views
from django.contrib import admin 
from django.urls import path,include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('auth/register/', views.register),
    path('auth/login/', views.login),
    path('auth/otp/send/', views.otp_send),
    path('auth/otp/verify/', views.otp_verify),
    path('products/', views.ProductList.as_view()),
    path('cart/', views.CartView.as_view()),
    path('cart/add/', views.cart_add),
    path('cart/remove/<int:item_id>/', views.cart_remove),
    path('orders/', views.OrderList.as_view()),
    path('orders/summary/', views.order_summary),
]
