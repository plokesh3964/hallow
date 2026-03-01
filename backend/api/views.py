import random
import string
from datetime import timedelta
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import User, Product, Cart, Order, OrderItem
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    OTPSendSerializer,
    OTPVerifySerializer,
    ProductSerializer,
    CartSerializer,
    CartAddSerializer,
    OrderSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    ser = UserRegisterSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = ser.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    ser = UserLoginSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = ser.validated_data['user']
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
    })


def _generate_otp():
    return ''.join(random.choices(string.digits, k=6))


@api_view(['POST'])
@permission_classes([AllowAny])
def otp_send(request):
    ser = OTPSendSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    phone = ser.validated_data['phone']
    user, created = User.objects.get_or_create(
        phone=phone,
        defaults={'username': f'user_{phone}'}
    )
    if not created and not user.phone:
        user.phone = phone
        user.save(update_fields=['phone'])
    otp = _generate_otp()
    user.otp = otp
    user.otp_created_at = timezone.now()
    user.save(update_fields=['otp', 'otp_created_at'])
    print(f'[OTP] Phone: {phone} -> OTP: {otp}')
    return Response({'message': 'OTP sent (check console)'})


@api_view(['POST'])
@permission_classes([AllowAny])
def otp_verify(request):
    ser = OTPVerifySerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    phone = ser.validated_data['phone']
    otp = ser.validated_data['otp']
    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({'error': 'Invalid phone'}, status=status.HTTP_400_BAD_REQUEST)
    if user.otp != otp:
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    expiry = user.otp_created_at + timedelta(minutes=10) if user.otp_created_at else None
    if expiry and timezone.now() > expiry:
        return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
    })


class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class CartView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cart_add(request):
    ser = CartAddSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    product = ser.validated_data['product_id']
    quantity = ser.validated_data['quantity']
    cart, created = Cart.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'quantity': quantity}
    )
    if not created:
        cart.quantity += quantity
        cart.save(update_fields=['quantity'])
    return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cart_remove(request, item_id):
    Cart.objects.filter(user=request.user, id=item_id).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def order_summary(request):
    cart_items = Cart.objects.filter(user=request.user).select_related('product')
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    total = sum(item.product.price * item.quantity for item in cart_items)
    order = Order.objects.create(user=request.user, total_amount=total, status='pending')
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price,
        )
    cart_items.delete()
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderList(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')
