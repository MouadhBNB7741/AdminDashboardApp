-- CreateEnum
CREATE TYPE "NotificationTypeTemp" AS ENUM ('email', 'sms', 'push', 'in_app');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('order', 'payment', 'delivery', 'product', 'promotion', 'system', 'review');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('email', 'sms', 'push', 'in_app');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('order_issue', 'payment_issue', 'delivery_issue', 'product_issue', 'account_issue', 'technical_issue', 'general_inquiry');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('WAITING', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "LiveChatMessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('login', 'logout', 'view_product', 'add_to_cart', 'remove_from_cart', 'search', 'place_order', 'payment', 'review');

-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('home', 'category', 'product', 'search', 'cart', 'checkout', 'profile', 'other');

-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('STRING', 'INTEGER', 'FLOAT', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "TaxApplicableTo" AS ENUM ('ALL', 'CATEGORY', 'PRODUCT');

-- CreateEnum
CREATE TYPE "EmailPriority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "SmsPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "SmsStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "ErrorLevel" AS ENUM ('debug', 'info', 'warning', 'error', 'critical');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('RETAIL', 'WHOLESALE', 'HOSPITAL', 'PHARMACY');

-- CreateEnum
CREATE TYPE "SupplierOrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SHIPPED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('card', 'bank_transfer', 'cash_on_delivery', 'digital_wallet');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORCYCLE', 'CAR', 'VAN', 'TRUCK');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'RETURNED');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('percentage', 'fixed_amount', 'free_shipping');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('SEASONAL', 'FLASH_SALE', 'BULK_DISCOUNT', 'NEW_CUSTOMER', 'LOYALTY');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "NotificationTypeTemp" NOT NULL,
    "subject_ar" TEXT,
    "subject_fr" TEXT,
    "subject_en" TEXT,
    "content_ar" TEXT,
    "content_fr" TEXT,
    "content_en" TEXT,
    "variables" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "template_id" INTEGER,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "action_url" TEXT,
    "action_text" TEXT,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'medium',
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "sent_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "read_at" TIMESTAMP(3),
    "metadata" JSONB,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" BIGSERIAL NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "order_id" BIGINT,
    "category" "SupportCategory" NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'medium',
    "status" "SupportStatus" NOT NULL DEFAULT 'open',
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assigned_to" BIGINT,
    "assigned_at" TIMESTAMP(3),
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" BIGINT,
    "satisfaction_rating" INTEGER,
    "satisfaction_feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicketMessage" (
    "id" BIGSERIAL NOT NULL,
    "ticket_id" BIGINT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "attachments" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveChatSession" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "agent_id" BIGINT,
    "status" "ChatStatus" NOT NULL DEFAULT 'WAITING',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "rating" INTEGER,
    "feedback" TEXT,

    CONSTRAINT "LiveChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveChatMessage" (
    "id" BIGSERIAL NOT NULL,
    "session_id" BIGINT NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "message" TEXT NOT NULL,
    "message_type" "LiveChatMessageType" NOT NULL DEFAULT 'TEXT',
    "attachment_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityLog" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "session_id" TEXT NOT NULL,
    "activity_type" "ActivityType" NOT NULL,
    "entity_type" TEXT,
    "entity_id" BIGINT,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "query" TEXT NOT NULL,
    "results_count" INTEGER NOT NULL DEFAULT 0,
    "filters_applied" JSONB,
    "clicked_product_id" BIGINT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "session_id" TEXT NOT NULL,
    "page_type" "PageType" NOT NULL,
    "page_url" TEXT NOT NULL,
    "page_title" TEXT,
    "entity_id" BIGINT,
    "time_spent" INTEGER,
    "bounce" BOOLEAN NOT NULL DEFAULT false,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" SERIAL NOT NULL,
    "setting_key" TEXT NOT NULL,
    "setting_value" TEXT,
    "setting_type" "SettingType" NOT NULL DEFAULT 'STRING',
    "category" TEXT NOT NULL DEFAULT 'general',
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tax" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TaxType" NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "applicable_to" "TaxApplicableTo" NOT NULL DEFAULT 'ALL',
    "category_ids" JSONB,
    "product_ids" JSONB,
    "wilaya_ids" JSONB,
    "min_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailQueue" (
    "id" BIGSERIAL NOT NULL,
    "to_email" TEXT NOT NULL,
    "to_name" TEXT,
    "from_email" TEXT,
    "from_name" TEXT,
    "subject" TEXT NOT NULL,
    "body_html" TEXT,
    "body_text" TEXT,
    "attachments" JSONB,
    "priority" "EmailPriority" NOT NULL DEFAULT 'medium',
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "status" "EmailStatus" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmsQueue" (
    "id" BIGSERIAL NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "SmsPriority" NOT NULL DEFAULT 'MEDIUM',
    "max_retries" INTEGER NOT NULL DEFAULT 3,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "status" "SmsStatus" NOT NULL DEFAULT 'PENDING',
    "error_message" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminActivityLog" (
    "id" BIGSERIAL NOT NULL,
    "admin_id" BIGINT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" BIGINT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" BIGSERIAL NOT NULL,
    "error_level" "ErrorLevel" NOT NULL,
    "error_message" TEXT NOT NULL,
    "error_code" TEXT,
    "file_path" TEXT,
    "line_number" INTEGER,
    "stack_trace" TEXT,
    "user_id" BIGINT,
    "request_url" TEXT,
    "request_method" TEXT,
    "request_data" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_name" TEXT NOT NULL,
    "variant_value" TEXT NOT NULL,
    "sku" TEXT,
    "barcode" TEXT,
    "price_adjustment" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "weight_adjustment" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPricing" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT,
    "customer_type" "CustomerType" NOT NULL DEFAULT 'RETAIL',
    "min_quantity" INTEGER NOT NULL DEFAULT 1,
    "max_quantity" INTEGER,
    "base_price" DECIMAL(65,30) NOT NULL,
    "sale_price" DECIMAL(65,30),
    "cost_price" DECIMAL(65,30),
    "margin_percentage" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductPricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInventory" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT,
    "supplier_id" BIGINT NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved_quantity" INTEGER NOT NULL DEFAULT 0,
    "available_quantity" INTEGER,
    "min_stock_level" INTEGER NOT NULL DEFAULT 0,
    "max_stock_level" INTEGER,
    "reorder_point" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "batch_number" TEXT,
    "expiry_date" TIMESTAMP(3),
    "manufacturing_date" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT,
    "supplier_id" BIGINT NOT NULL,
    "product_name" TEXT NOT NULL,
    "variant_name" TEXT,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,
    "cost_price" DECIMAL(65,30),
    "commission_rate" DECIMAL(65,30),
    "commission_amount" DECIMAL(65,30),
    "requires_prescription" BOOLEAN NOT NULL DEFAULT false,
    "prescription_provided" BOOLEAN NOT NULL DEFAULT false,
    "prescription_url" TEXT,
    "supplier_status" "SupplierOrderStatus" NOT NULL DEFAULT 'PENDING',
    "supplier_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "provider" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "processing_fee_percentage" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "processing_fee_fixed" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "min_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "max_amount" DECIMAL(65,30),
    "logo_url" TEXT,
    "description_ar" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" BIGSERIAL NOT NULL,
    "payment_reference" TEXT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "gateway_transaction_id" TEXT,
    "gateway_response" JSONB,
    "payment_details" JSONB,
    "processing_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "api_endpoint" TEXT,
    "api_key" TEXT,
    "tracking_url_template" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "base_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "per_kg_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "insurance_percentage" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryPersonnel" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "delivery_company_id" INTEGER,
    "employee_id" TEXT,
    "vehicle_type" "VehicleType" NOT NULL DEFAULT 'MOTORCYCLE',
    "vehicle_registration" TEXT,
    "license_number" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "current_latitude" DECIMAL(65,30),
    "current_longitude" DECIMAL(65,30),
    "last_location_update" TIMESTAMP(3),
    "rating" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "total_deliveries" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPersonnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" BIGSERIAL NOT NULL,
    "order_id" BIGINT NOT NULL,
    "delivery_company_id" INTEGER,
    "delivery_person_id" BIGINT,
    "tracking_number" TEXT,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "pickup_address" TEXT,
    "pickup_phone" TEXT,
    "pickup_date" TIMESTAMP(3),
    "pickup_time_slot" TEXT,
    "actual_pickup_time" TIMESTAMP(3),
    "delivery_address" TEXT,
    "delivery_phone" TEXT,
    "delivery_date" TIMESTAMP(3),
    "delivery_time_slot" TEXT,
    "actual_delivery_time" TIMESTAMP(3),
    "recipient_name" TEXT,
    "delivery_notes" TEXT,
    "delivery_proof_url" TEXT,
    "delivery_fee" DECIMAL(65,30) NOT NULL,
    "insurance_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "cod_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "current_location_lat" DECIMAL(65,30),
    "current_location_lng" DECIMAL(65,30),
    "estimated_delivery_time" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryTracking" (
    "id" BIGSERIAL NOT NULL,
    "delivery_id" BIGINT NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "location" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeliveryTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CouponType" NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "minimum_order_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "maximum_discount_amount" DECIMAL(65,30),
    "usage_limit" INTEGER,
    "usage_limit_per_user" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3),
    "applicable_to_categories" JSONB,
    "applicable_to_products" JSONB,
    "applicable_to_user_types" JSONB,
    "exclude_sale_items" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponUsage" (
    "id" BIGSERIAL NOT NULL,
    "coupon_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "discount_amount" DECIMAL(65,30) NOT NULL,
    "used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionalCampaign" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CampaignType" NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(65,30) NOT NULL,
    "minimum_quantity" INTEGER NOT NULL DEFAULT 1,
    "minimum_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "applicable_to_categories" JSONB,
    "applicable_to_products" JSONB,
    "applicable_to_brands" JSONB,
    "applicable_to_user_types" JSONB,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "usage_limit" INTEGER,
    "usage_limit_per_user" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromotionalCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderToPaymentMethod" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrderToPaymentMethod_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DeliveryCompanyToOrder" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL,

    CONSTRAINT "_DeliveryCompanyToOrder_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_name_key" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "idx_name_notification_template" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "idx_type_notification_template" ON "NotificationTemplate"("type");

-- CreateIndex
CREATE INDEX "idx_active_notification_template" ON "NotificationTemplate"("is_active");

-- CreateIndex
CREATE INDEX "idx_user_id_notification" ON "Notification"("user_id");

-- CreateIndex
CREATE INDEX "idx_type_notification" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "idx_channel_notification" ON "Notification"("channel");

-- CreateIndex
CREATE INDEX "idx_status_notification" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "idx_priority_notification" ON "Notification"("priority");

-- CreateIndex
CREATE INDEX "idx_created_at_notification" ON "Notification"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_id_notification_preference" ON "NotificationPreference"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_user_id_notification_type_key" ON "NotificationPreference"("user_id", "notification_type");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticket_number_key" ON "SupportTicket"("ticket_number");

-- CreateIndex
CREATE INDEX "idx_user_id_support_ticket" ON "SupportTicket"("user_id");

-- CreateIndex
CREATE INDEX "idx_order_id_support_ticket" ON "SupportTicket"("order_id");

-- CreateIndex
CREATE INDEX "idx_ticket_number" ON "SupportTicket"("ticket_number");

-- CreateIndex
CREATE INDEX "idx_status_support_ticket" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "idx_priority_support_ticket" ON "SupportTicket"("priority");

-- CreateIndex
CREATE INDEX "idx_assigned_to_support_ticket" ON "SupportTicket"("assigned_to");

-- CreateIndex
CREATE INDEX "idx_ticket_id" ON "SupportTicketMessage"("ticket_id");

-- CreateIndex
CREATE INDEX "idx_sender_id" ON "SupportTicketMessage"("sender_id");

-- CreateIndex
CREATE INDEX "idx_created_at_support_ticket_message" ON "SupportTicketMessage"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_id_chat" ON "LiveChatSession"("user_id");

-- CreateIndex
CREATE INDEX "idx_agent_id_chat" ON "LiveChatSession"("agent_id");

-- CreateIndex
CREATE INDEX "idx_status_chat" ON "LiveChatSession"("status");

-- CreateIndex
CREATE INDEX "idx_session_id" ON "LiveChatMessage"("session_id");

-- CreateIndex
CREATE INDEX "idx_sender_id_live_chat_message" ON "LiveChatMessage"("sender_id");

-- CreateIndex
CREATE INDEX "idx_created_at_live_chat_message" ON "LiveChatMessage"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_id_user_activity_log" ON "UserActivityLog"("user_id");

-- CreateIndex
CREATE INDEX "idx_activity_type" ON "UserActivityLog"("activity_type");

-- CreateIndex
CREATE INDEX "idx_entity" ON "UserActivityLog"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_created_at_user_activity_log" ON "UserActivityLog"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_id_search" ON "SearchQuery"("user_id");

-- CreateIndex
CREATE INDEX "idx_created_at_search" ON "SearchQuery"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_id_page_view" ON "PageView"("user_id");

-- CreateIndex
CREATE INDEX "idx_session_id_page_view" ON "PageView"("session_id");

-- CreateIndex
CREATE INDEX "idx_page_type" ON "PageView"("page_type");

-- CreateIndex
CREATE INDEX "idx_entity_id" ON "PageView"("entity_id");

-- CreateIndex
CREATE INDEX "idx_created_at_page_view" ON "PageView"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_setting_key_key" ON "SystemSetting"("setting_key");

-- CreateIndex
CREATE INDEX "idx_key" ON "SystemSetting"("setting_key");

-- CreateIndex
CREATE INDEX "idx_category" ON "SystemSetting"("category");

-- CreateIndex
CREATE INDEX "idx_public" ON "SystemSetting"("is_public");

-- CreateIndex
CREATE INDEX "idx_tax_type" ON "Tax"("type");

-- CreateIndex
CREATE INDEX "idx_tax_active" ON "Tax"("is_active");

-- CreateIndex
CREATE INDEX "idx_status_email_queue" ON "EmailQueue"("status");

-- CreateIndex
CREATE INDEX "idx_priority" ON "EmailQueue"("priority");

-- CreateIndex
CREATE INDEX "idx_created_at_email_queue" ON "EmailQueue"("created_at");

-- CreateIndex
CREATE INDEX "idx_phone_sms" ON "SmsQueue"("phone_number");

-- CreateIndex
CREATE INDEX "idx_status_sms" ON "SmsQueue"("status");

-- CreateIndex
CREATE INDEX "idx_priority_sms" ON "SmsQueue"("priority");

-- CreateIndex
CREATE INDEX "idx_created_at_sms" ON "SmsQueue"("created_at");

-- CreateIndex
CREATE INDEX "idx_admin_id" ON "AdminActivityLog"("admin_id");

-- CreateIndex
CREATE INDEX "idx_action" ON "AdminActivityLog"("action");

-- CreateIndex
CREATE INDEX "idx_entity_admin_activity_log" ON "AdminActivityLog"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_created_at_admin_activity_log" ON "AdminActivityLog"("created_at");

-- CreateIndex
CREATE INDEX "idx_error_level" ON "ErrorLog"("error_level");

-- CreateIndex
CREATE INDEX "idx_error_code" ON "ErrorLog"("error_code");

-- CreateIndex
CREATE INDEX "idx_user_id_error_log" ON "ErrorLog"("user_id");

-- CreateIndex
CREATE INDEX "idx_created_at_error_log" ON "ErrorLog"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "idx_product_id_product_variant" ON "ProductVariant"("product_id");

-- CreateIndex
CREATE INDEX "idx_sku_product_variant" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_product_id_variant_name_variant_value_key" ON "ProductVariant"("product_id", "variant_name", "variant_value");

-- CreateIndex
CREATE INDEX "idx_product_id_pricing" ON "ProductPricing"("product_id");

-- CreateIndex
CREATE INDEX "idx_variant_id_pricing" ON "ProductPricing"("variant_id");

-- CreateIndex
CREATE INDEX "idx_customer_type_pricing" ON "ProductPricing"("customer_type");

-- CreateIndex
CREATE INDEX "idx_pricing_active" ON "ProductPricing"("is_active");

-- CreateIndex
CREATE INDEX "idx_product_variant" ON "ProductInventory"("product_id", "variant_id");

-- CreateIndex
CREATE INDEX "idx_supplier_id_product_inventory" ON "ProductInventory"("supplier_id");

-- CreateIndex
CREATE INDEX "idx_stock_quantity" ON "ProductInventory"("stock_quantity");

-- CreateIndex
CREATE INDEX "idx_expiry_date" ON "ProductInventory"("expiry_date");

-- CreateIndex
CREATE INDEX "idx_user_id_cart" ON "ShoppingCart"("user_id");

-- CreateIndex
CREATE INDEX "idx_product_id_cart" ON "ShoppingCart"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_user_id_product_id_variant_id_key" ON "ShoppingCart"("user_id", "product_id", "variant_id");

-- CreateIndex
CREATE INDEX "idx_order_id_order_item" ON "OrderItem"("order_id");

-- CreateIndex
CREATE INDEX "idx_product_id_order_item" ON "OrderItem"("product_id");

-- CreateIndex
CREATE INDEX "idx_supplier_id_order_item" ON "OrderItem"("supplier_id");

-- CreateIndex
CREATE INDEX "idx_supplier_status" ON "OrderItem"("supplier_status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_code_key" ON "PaymentMethod"("code");

-- CreateIndex
CREATE INDEX "idx_code" ON "PaymentMethod"("code");

-- CreateIndex
CREATE INDEX "idx_type" ON "PaymentMethod"("type");

-- CreateIndex
CREATE INDEX "idx_payment_method_active" ON "PaymentMethod"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payment_reference_key" ON "Payment"("payment_reference");

-- CreateIndex
CREATE INDEX "idx_order_id_payment" ON "Payment"("order_id");

-- CreateIndex
CREATE INDEX "idx_payment_reference" ON "Payment"("payment_reference");

-- CreateIndex
CREATE INDEX "idx_status_payment" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "idx_gateway_transaction_id" ON "Payment"("gateway_transaction_id");

-- CreateIndex
CREATE INDEX "idx_name_delivery_company" ON "DeliveryCompany"("name");

-- CreateIndex
CREATE INDEX "idx_delivery_company_active" ON "DeliveryCompany"("is_active");

-- CreateIndex
CREATE INDEX "idx_delivery_company" ON "DeliveryPersonnel"("delivery_company_id");

-- CreateIndex
CREATE INDEX "idx_delivery_personnel_active" ON "DeliveryPersonnel"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPersonnel_user_id_key" ON "DeliveryPersonnel"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_tracking_number_key" ON "Delivery"("tracking_number");

-- CreateIndex
CREATE INDEX "idx_order_id_delivery" ON "Delivery"("order_id");

-- CreateIndex
CREATE INDEX "idx_tracking_number" ON "Delivery"("tracking_number");

-- CreateIndex
CREATE INDEX "idx_status_delivery" ON "Delivery"("status");

-- CreateIndex
CREATE INDEX "idx_delivery_person" ON "Delivery"("delivery_person_id");

-- CreateIndex
CREATE INDEX "idx_delivery_id_tracking" ON "DeliveryTracking"("delivery_id");

-- CreateIndex
CREATE INDEX "idx_status_tracking" ON "DeliveryTracking"("status");

-- CreateIndex
CREATE INDEX "idx_created_at_tracking" ON "DeliveryTracking"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "idx_coupon_code" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "idx_valid_dates" ON "Coupon"("valid_from", "valid_until");

-- CreateIndex
CREATE INDEX "idx_coupon_active" ON "Coupon"("is_active");

-- CreateIndex
CREATE INDEX "idx_coupon_id_usage" ON "CouponUsage"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_user_id_usage" ON "CouponUsage"("user_id");

-- CreateIndex
CREATE INDEX "idx_order_id_usage" ON "CouponUsage"("order_id");

-- CreateIndex
CREATE INDEX "idx_campaign_type" ON "PromotionalCampaign"("type");

-- CreateIndex
CREATE INDEX "idx_campaign_dates" ON "PromotionalCampaign"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_campaign_active" ON "PromotionalCampaign"("is_active");

-- CreateIndex
CREATE INDEX "_OrderToPaymentMethod_B_index" ON "_OrderToPaymentMethod"("B");

-- CreateIndex
CREATE INDEX "_DeliveryCompanyToOrder_B_index" ON "_DeliveryCompanyToOrder"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "NotificationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketMessage" ADD CONSTRAINT "SupportTicketMessage_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketMessage" ADD CONSTRAINT "SupportTicketMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveChatSession" ADD CONSTRAINT "LiveChatSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveChatSession" ADD CONSTRAINT "LiveChatSession_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveChatMessage" ADD CONSTRAINT "LiveChatMessage_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "LiveChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveChatMessage" ADD CONSTRAINT "LiveChatMessage_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchQuery" ADD CONSTRAINT "SearchQuery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchQuery" ADD CONSTRAINT "SearchQuery_clicked_product_id_fkey" FOREIGN KEY ("clicked_product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageView" ADD CONSTRAINT "PageView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminActivityLog" ADD CONSTRAINT "AdminActivityLog_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorLog" ADD CONSTRAINT "ErrorLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPricing" ADD CONSTRAINT "ProductPricing_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPricing" ADD CONSTRAINT "ProductPricing_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInventory" ADD CONSTRAINT "ProductInventory_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPersonnel" ADD CONSTRAINT "DeliveryPersonnel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPersonnel" ADD CONSTRAINT "DeliveryPersonnel_delivery_company_id_fkey" FOREIGN KEY ("delivery_company_id") REFERENCES "DeliveryCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_company_id_fkey" FOREIGN KEY ("delivery_company_id") REFERENCES "DeliveryCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "DeliveryPersonnel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTracking" ADD CONSTRAINT "DeliveryTracking_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionalCampaign" ADD CONSTRAINT "PromotionalCampaign_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToPaymentMethod" ADD CONSTRAINT "_OrderToPaymentMethod_A_fkey" FOREIGN KEY ("A") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderToPaymentMethod" ADD CONSTRAINT "_OrderToPaymentMethod_B_fkey" FOREIGN KEY ("B") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryCompanyToOrder" ADD CONSTRAINT "_DeliveryCompanyToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "DeliveryCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeliveryCompanyToOrder" ADD CONSTRAINT "_DeliveryCompanyToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
