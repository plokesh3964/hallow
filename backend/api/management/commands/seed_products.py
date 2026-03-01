from django.core.management.base import BaseCommand
from api.models import Product


class Command(BaseCommand):
    help = 'Seed sample products'

    def handle(self, *args, **options):
        products = [
            {'name': 'Wireless Mouse', 'description': 'Ergonomic wireless mouse', 'price': 29.99, 'stock': 50},
            {'name': 'USB-C Hub', 'description': '7-in-1 USB-C hub', 'price': 49.99, 'stock': 30},
            {'name': 'Mechanical Keyboard', 'description': 'RGB mechanical keyboard', 'price': 89.99, 'stock': 20},
            {'name': 'Monitor Stand', 'description': 'Adjustable monitor stand', 'price': 39.99, 'stock': 40},
            {'name': 'Laptop Sleeve', 'description': '13" laptop sleeve', 'price': 24.99, 'stock': 100},
        ]
        for p in products:
            Product.objects.get_or_create(name=p['name'], defaults=p)
        self.stdout.write(self.style.SUCCESS(f'Created {len(products)} products'))
