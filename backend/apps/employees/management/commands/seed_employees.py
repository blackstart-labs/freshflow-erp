from datetime import date, timedelta
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.authentication.models import UserRole
from apps.employees.models import (
    AuditLog,
    Department,
    EmployeeProfile,
    EmploymentStatus,
    EmploymentType,
)

User = get_user_model()


class Command(BaseCommand):
    help = "Seed initial departments, employees, and audit logs matching FreshFlow reference design."

    def handle(self, *args, **options):
        self.stdout.write("Seeding departments...")
        dept_wh, _ = Department.objects.get_or_create(
            code="WH-LOG",
            defaults={
                "name": "Warehouse & Logistics",
                "description": "Inventory, temperature tracking, cold chain compliance, and dispatch management.",
            },
        )
        dept_ops, _ = Department.objects.get_or_create(
            code="OPS",
            defaults={
                "name": "Operations",
                "description": "Supply chain execution and operations oversight.",
            },
        )
        dept_sales, _ = Department.objects.get_or_create(
            code="SALES",
            defaults={
                "name": "Sales & Client Relations",
                "description": "Restaurant onboarding, dynamic pricing, and order fulfillment.",
            },
        )
        dept_exec, _ = Department.objects.get_or_create(
            code="EXEC",
            defaults={
                "name": "Executive & Administration",
                "description": "Executive leadership and systems administration.",
            },
        )

        self.stdout.write("Seeding supervisor Ahmed Rahman...")
        ahmed_user, _ = User.objects.get_or_create(
            username="ahmed_rahman",
            defaults={
                "email": "a.rahman@freshflow.com",
                "first_name": "Ahmed",
                "last_name": "Rahman",
                "role": UserRole.ADMIN,
                "phone_number": "+880 1711 000111",
            },
        )
        if not ahmed_user.has_usable_password():
            ahmed_user.set_password("Password123!")
            ahmed_user.save()

        ahmed_profile, _ = EmployeeProfile.objects.get_or_create(
            user=ahmed_user,
            defaults={
                "employee_id": "FF-OPS-0002",
                "official_full_name": "Ahmed Rahman",
                "company_email": "a.rahman@freshflow.com",
                "department": dept_ops,
                "designation": "Operations Director",
                "employment_type": EmploymentType.FULL_TIME,
                "employment_status": EmploymentStatus.ACTIVE,
                "date_of_joining": date(2023, 1, 15),
                "work_location": "Dhaka Headquarters",
                "shift_schedule": "Day Shift (8:30 AM – 5:30 PM)",
                "salary_grade": "Grade 1 (Executive)",
                "personal_phone": "+880 1711 000111",
            },
        )

        self.stdout.write("Linking Mohammad Ahsan (warehouse_demo)...")
        # Find warehouse_demo or mohammad_ahsan
        wh_user = User.objects.filter(username__in=["warehouse_demo", "mohammad_ahsan"]).first()
        if not wh_user:
            wh_user = User.objects.create_user(
                username="warehouse_demo",
                email="m.ahsan@freshflow.com",
                password="Password123!",
                first_name="Mohammad",
                last_name="Ahsan",
                role=UserRole.WAREHOUSE_MANAGER,
                phone_number="+880 1712 345678",
            )
        else:
            wh_user.first_name = "Mohammad"
            wh_user.last_name = "Ahsan"
            wh_user.email = "m.ahsan@freshflow.com"
            wh_user.phone_number = "+880 1712 345678"
            wh_user.save()

        wh_profile, _ = EmployeeProfile.objects.update_or_create(
            user=wh_user,
            defaults={
                "employee_id": "FF-WH-0024",
                "official_full_name": "Mohammad Ahsan",
                "company_email": "m.ahsan@freshflow.com",
                "department": dept_wh,
                "designation": "Warehouse Manager",
                "employment_type": EmploymentType.FULL_TIME,
                "employment_status": EmploymentStatus.ACTIVE,
                "date_of_joining": date(2024, 1, 12),
                "reporting_manager": ahmed_profile,
                "work_location": "Dhaka Warehouse (Main)",
                "shift_schedule": "Day Shift (9:00 AM – 6:00 PM)",
                "salary_grade": "Grade 2 (Operations)",
                "personal_email": "m.ahsan@freshflow.com",
                "personal_phone": "+880 1712 345678",
                "date_of_birth": date(1992, 3, 15),
                "gender": "Male",
                "national_id": "19923657891234",
                "address": "House 12, Road 4, Dhanmondi, Dhaka 1205, Bangladesh",
                "emergency_contact_name": "Nusrat Jahan",
                "emergency_contact_phone": "+880 1811 223344",
                "blood_group": "B+",
                "marital_status": "Married",
                "nationality": "Bangladeshi",
                "preferred_language": "English, Bangla",
                "created_by": ahmed_user,
            },
        )

        self.stdout.write("Linking Admin (admin_demo)...")
        admin_user = User.objects.filter(username__in=["admin_demo", "tanvir_admin"]).first()
        if not admin_user:
            admin_user = User.objects.create_user(
                username="admin_demo",
                email="admin@freshflow.com",
                password="Password123!",
                first_name="Tanvir",
                last_name="Ahmed",
                role=UserRole.ADMIN,
                is_staff=True,
                is_superuser=True,
                phone_number="+880 1700 123456",
            )
        else:
            admin_user.set_password("Password123!")
            admin_user.role = UserRole.ADMIN
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()

        EmployeeProfile.objects.get_or_create(
            user=admin_user,
            defaults={
                "employee_id": "FF-AD-0001",
                "official_full_name": "Tanvir Ahmed",
                "company_email": "tanvir@freshflow.com",
                "department": dept_exec,
                "designation": "System Administrator",
                "employment_type": EmploymentType.FULL_TIME,
                "employment_status": EmploymentStatus.ACTIVE,
                "date_of_joining": date(2023, 6, 1),
                "work_location": "Dhaka Headquarters",
                "shift_schedule": "Flexible",
                "salary_grade": "Grade 1 (Executive)",
                "personal_phone": "+880 1700 123456",
            },
        )

        self.stdout.write("Linking Sales Agent (sales_demo)...")
        sales_user = User.objects.filter(username="sales_demo").first()
        if not sales_user:
            sales_user = User.objects.create_user(
                username="sales_demo",
                email="sales@freshflow.com",
                password="Password123!",
                first_name="Samira",
                last_name="Khan",
                role=UserRole.SALES_AGENT,
                phone_number="+880 1713 998877",
            )
        else:
            sales_user.set_password("Password123!")
            sales_user.role = UserRole.SALES_AGENT
            sales_user.save()

        EmployeeProfile.objects.get_or_create(
            user=sales_user,
            defaults={
                "employee_id": "FF-SA-0010",
                "official_full_name": "Samira Khan",
                "company_email": "sales@freshflow.com",
                "department": dept_sales,
                "designation": "Sales Representative",
                "employment_type": EmploymentType.FULL_TIME,
                "employment_status": EmploymentStatus.ACTIVE,
                "date_of_joining": date(2024, 2, 1),
                "work_location": "Dhaka Headquarters",
                "shift_schedule": "Day Shift (9:00 AM – 6:00 PM)",
                "salary_grade": "Grade 2 (Operations)",
            },
        )

        self.stdout.write("Linking Restaurant Client (bistro_chef)...")
        client_user = User.objects.filter(username="bistro_chef").first()
        if not client_user:
            client_user = User.objects.create_user(
                username="bistro_chef",
                email="chef@bistroparis.com",
                password="StrongPassword123!",
                first_name="Jean",
                last_name="Luc",
                role=UserRole.RESTAURANT_CLIENT,
                phone_number="+880 1819 001122",
            )
        else:
            client_user.set_password("StrongPassword123!")
            client_user.role = UserRole.RESTAURANT_CLIENT
            client_user.save()

        from decimal import Decimal
        from apps.crm.models import Restaurant, RestaurantTier
        Restaurant.objects.get_or_create(
            user=client_user,
            defaults={
                "business_name": "The French Bistro",
                "trade_license_no": "TL-DHK-2024-8841",
                "tier": RestaurantTier.GOLD,
                "total_spent_last_3_months": Decimal("18500.00"),
                "credit_limit": Decimal("10000.00"),
            },
        )

        # Seed perishable items and stock batches if none exist
        from apps.inventory.models import PerishableItem, StockBatch, ItemCategory, BatchStatus
        if PerishableItem.objects.count() == 0:
            self.stdout.write("Seeding sample perishable inventory catalog and batches...")
            item_salmon = PerishableItem.objects.create(
                name="Norwegian Salmon Fillet",
                category=ItemCategory.SEAFOOD,
                required_temp_celsius=Decimal("-2.00"),
                temp_tolerance_celsius=Decimal("1.00"),
                standard_shelf_life_days=10,
                unit_of_measure="kg",
            )
            item_ribeye = PerishableItem.objects.create(
                name="Prime Ribeye Steak",
                category=ItemCategory.MEAT_POULTRY,
                required_temp_celsius=Decimal("1.50"),
                temp_tolerance_celsius=Decimal("1.00"),
                standard_shelf_life_days=14,
                unit_of_measure="kg",
            )
            item_chicken = PerishableItem.objects.create(
                name="Organic Chicken Breast",
                category=ItemCategory.MEAT_POULTRY,
                required_temp_celsius=Decimal("1.00"),
                temp_tolerance_celsius=Decimal("0.50"),
                standard_shelf_life_days=7,
                unit_of_measure="kg",
            )
            item_cheese = PerishableItem.objects.create(
                name="Fresh Mozzarella",
                category=ItemCategory.DAIRY,
                required_temp_celsius=Decimal("3.00"),
                temp_tolerance_celsius=Decimal("1.00"),
                standard_shelf_life_days=21,
                unit_of_measure="unit",
            )
            item_lettuce = PerishableItem.objects.create(
                name="Romaine Lettuce Hearts",
                category=ItemCategory.PRODUCE,
                required_temp_celsius=Decimal("4.00"),
                temp_tolerance_celsius=Decimal("1.50"),
                standard_shelf_life_days=12,
                unit_of_measure="crate",
            )

            today = date.today()
            StockBatch.objects.create(
                batch_number="CB-402",
                item=item_salmon,
                harvest_pack_date=today - timedelta(days=2),
                expiry_date=today + timedelta(days=5),
                initial_quantity=Decimal("150.00"),
                current_quantity=Decimal("120.00"),
                purchase_cost=Decimal("18.50"),
                base_selling_price=Decimal("26.00"),
                status=BatchStatus.AVAILABLE,
                storage_bin="COLD-ZONE-B2",
            )
            StockBatch.objects.create(
                batch_number="CB-403",
                item=item_ribeye,
                harvest_pack_date=today - timedelta(days=3),
                expiry_date=today + timedelta(days=8),
                initial_quantity=Decimal("200.00"),
                current_quantity=Decimal("175.00"),
                purchase_cost=Decimal("24.00"),
                base_selling_price=Decimal("34.50"),
                status=BatchStatus.AVAILABLE,
                storage_bin="COLD-ZONE-A1",
            )
            StockBatch.objects.create(
                batch_number="CB-404",
                item=item_chicken,
                harvest_pack_date=today - timedelta(days=4),
                expiry_date=today + timedelta(days=1), # near expiry -> flash sale
                initial_quantity=Decimal("300.00"),
                current_quantity=Decimal("90.00"),
                purchase_cost=Decimal("6.50"),
                base_selling_price=Decimal("10.00"),
                status=BatchStatus.FLASH_SALE,
                storage_bin="COLD-ZONE-A2",
            )
            StockBatch.objects.create(
                batch_number="CB-405",
                item=item_cheese,
                harvest_pack_date=today - timedelta(days=5),
                expiry_date=today + timedelta(days=15),
                initial_quantity=Decimal("100.00"),
                current_quantity=Decimal("85.00"),
                purchase_cost=Decimal("8.00"),
                base_selling_price=Decimal("12.50"),
                status=BatchStatus.AVAILABLE,
                storage_bin="COLD-ZONE-C1",
            )
            StockBatch.objects.create(
                batch_number="CB-406",
                item=item_lettuce,
                harvest_pack_date=today - timedelta(days=1),
                expiry_date=today + timedelta(days=9),
                initial_quantity=Decimal("80.00"),
                current_quantity=Decimal("65.00"),
                purchase_cost=Decimal("12.00"),
                base_selling_price=Decimal("18.00"),
                status=BatchStatus.AVAILABLE,
                storage_bin="COLD-ZONE-D1",
            )

        self.stdout.write("Seeding sample audit logs for Mohammad Ahsan...")
        now = timezone.now()
        # Clean existing sample logs for clean display
        AuditLog.objects.filter(actor=wh_user).delete()

        sample_logs = [
            {
                "action": "LOGIN_SUCCESS",
                "category": "AUTH",
                "description": "Logged in to the system",
                "resource_type": "Session",
                "resource_id": "session_8f912",
                "metadata": {"ip": "103.145.118.22", "location": "Dhaka, BD", "device": "Chrome on macOS"},
                "ip_address": "103.145.118.22",
                "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0.0.0",
                "time_offset": timedelta(minutes=2),
            },
            {
                "action": "TEMPERATURE_LOG_RECORDED",
                "category": "INVENTORY",
                "description": "Updated temperature log (Freezer A1)",
                "resource_type": "ColdStorageZone",
                "resource_id": "Freezer A1",
                "metadata": {"zone": "Freezer A1", "temperature": -18.2, "status": "OPTIMAL"},
                "time_offset": timedelta(hours=1),
            },
            {
                "action": "STOCK_BATCH_RECEIVED",
                "category": "INVENTORY",
                "description": "Received stock batch CB-402",
                "resource_type": "StockBatch",
                "resource_id": "CB-402",
                "metadata": {"batch_number": "CB-402", "item": "Norwegian Salmon Fillet", "quantity": "120 kg"},
                "time_offset": timedelta(hours=3),
            },
            {
                "action": "ORDER_PROCESSED",
                "category": "ORDERS",
                "description": "Processed order #ORD-1284",
                "resource_type": "Order",
                "resource_id": "ORD-1284",
                "metadata": {"client": "Pizza Hut", "order_number": "ORD-1284", "status": "ALLOCATED"},
                "time_offset": timedelta(hours=5),
            },
            {
                "action": "PROFILE_UPDATED",
                "category": "PROFILE",
                "description": "Updated profile information",
                "resource_type": "EmployeeProfile",
                "resource_id": str(wh_profile.id),
                "metadata": {"updated_fields": ["phone_number", "address"]},
                "time_offset": timedelta(days=2),
            },
        ]

        for entry in sample_logs:
            created_at = now - entry.pop("time_offset")
            log = AuditLog.objects.create(
                actor=wh_user,
                target_user=wh_user,
                action=entry["action"],
                category=entry["category"],
                description=entry["description"],
                resource_type=entry["resource_type"],
                resource_id=entry["resource_id"],
                metadata=entry.get("metadata", {}),
                ip_address=entry.get("ip_address"),
                user_agent=entry.get("user_agent", ""),
            )
            # Override created_at with historical time
            AuditLog.objects.filter(id=log.id).update(created_at=created_at)

        self.stdout.write(self.style.SUCCESS("Successfully seeded employee workforce data!"))
