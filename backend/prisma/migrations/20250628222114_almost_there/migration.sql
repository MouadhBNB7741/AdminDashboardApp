-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CUSTOMER', 'SUPPLIER', 'ADMIN', 'DELIVERY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('AR', 'FR', 'EN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('hospital', 'clinic', 'pharmacy', 'individual');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('manufacturer', 'distributor', 'retailer', 'importer');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('basic', 'premium', 'enterprise');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'WORK', 'OTHER');

-- CreateEnum
CREATE TYPE "PrescriptionType" AS ENUM ('none', 'otc', 'prescription', 'controlled');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('draft', 'pending', 'active', 'inactive', 'discontinued');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('STANDARD', 'EXPRESS', 'PICKUP');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('helpful', 'not_helpful');

-- CreateEnum
CREATE TYPE "PrescriptionItemStatus" AS ENUM ('PENDING', 'MATCHED', 'NOT_AVAILABLE', 'SUBSTITUTED');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "user_type" "UserType" NOT NULL DEFAULT 'CUSTOMER',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "language" "Language" NOT NULL DEFAULT 'AR',
    "dark_mode" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User2FA" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "backup_codes" JSONB,
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User2FA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "gender" "Gender",
    "national_id" TEXT,
    "profession" TEXT,
    "medical_license" TEXT,
    "organization_name" TEXT,
    "organization_type" "OrganizationType",
    "tax_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierProfile" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_registration" TEXT NOT NULL,
    "tax_number" TEXT NOT NULL,
    "medical_license" TEXT,
    "business_type" "BusinessType",
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "verification_documents" JSONB,
    "annual_revenue" DECIMAL(65,30),
    "established_year" INTEGER,
    "employee_count" INTEGER,
    "warehouse_capacity" INTEGER,
    "subscription_type" "SubscriptionType" NOT NULL DEFAULT 'basic',
    "subscription_expires_at" TIMESTAMP(3),
    "commission_rate" DECIMAL(65,30) NOT NULL DEFAULT 5.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wilaya" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "delivery_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" SERIAL NOT NULL,
    "wilaya_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "postal_code" TEXT,
    "additional_delivery_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "wilaya_id" INTEGER NOT NULL,
    "commune_id" INTEGER NOT NULL,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "postal_code" TEXT,
    "landmark" TEXT,
    "phone" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "address_type" "AddressType" NOT NULL DEFAULT 'HOME',
    "recipient_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "parent_id" INTEGER,
    "name_ar" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_ar" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "icon" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description_ar" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "logo_url" TEXT,
    "website" TEXT,
    "country_origin" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" BIGSERIAL NOT NULL,
    "supplier_id" BIGINT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "brand_id" INTEGER,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "name_ar" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_ar" TEXT,
    "description_fr" TEXT,
    "description_en" TEXT,
    "short_description_ar" TEXT,
    "short_description_fr" TEXT,
    "short_description_en" TEXT,
    "specifications" JSONB,
    "ingredients" TEXT,
    "usage_instructions_ar" TEXT,
    "usage_instructions_fr" TEXT,
    "usage_instructions_en" TEXT,
    "warnings_ar" TEXT,
    "warnings_fr" TEXT,
    "warnings_en" TEXT,
    "requires_prescription" BOOLEAN NOT NULL DEFAULT false,
    "prescription_type" "PrescriptionType" NOT NULL DEFAULT 'none',
    "age_restriction" INTEGER,
    "weight" DECIMAL(65,30),
    "dimensions" TEXT,
    "material" TEXT,
    "sterile" BOOLEAN NOT NULL DEFAULT false,
    "disposable" BOOLEAN NOT NULL DEFAULT false,
    "expiry_tracking" BOOLEAN NOT NULL DEFAULT false,
    "batch_tracking" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProductStatus" NOT NULL DEFAULT 'draft',
    "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "slug" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewImage" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt_text" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "order_id" BIGINT,
    "rating" INTEGER NOT NULL,
    "review_text" TEXT,
    "pros" TEXT,
    "cons" TEXT,
    "verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "helpful_votes" INTEGER NOT NULL DEFAULT 0,
    "total_votes" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "moderation_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" BIGSERIAL NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "delivery_fee" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "delivery_method" "DeliveryMethod" NOT NULL DEFAULT 'STANDARD',
    "delivery_address_id" BIGINT,
    "delivery_notes" TEXT,
    "estimated_delivery_date" TIMESTAMP(3),
    "actual_delivery_date" TIMESTAMP(3),
    "has_prescription_items" BOOLEAN NOT NULL DEFAULT false,
    "prescription_verified" BOOLEAN NOT NULL DEFAULT false,
    "prescription_notes" TEXT,
    "customer_notes" TEXT,
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewVote" (
    "id" BIGSERIAL NOT NULL,
    "review_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierReview" (
    "id" BIGSERIAL NOT NULL,
    "supplier_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "order_id" BIGINT,
    "rating" INTEGER NOT NULL,
    "communication_rating" INTEGER,
    "delivery_rating" INTEGER,
    "product_quality_rating" INTEGER,
    "review_text" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "order_id" BIGINT,
    "prescription_number" TEXT,
    "doctor_name" TEXT,
    "doctor_license" TEXT,
    "hospital_clinic" TEXT,
    "issue_date" TIMESTAMP(3),
    "expiry_date" TIMESTAMP(3),
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "file_size" INTEGER,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "verified_by" BIGINT,
    "verified_at" TIMESTAMP(3),
    "verification_notes" TEXT,
    "patient_name" TEXT,
    "patient_age" INTEGER,
    "patient_weight" DECIMAL(65,30),
    "patient_allergies" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" BIGSERIAL NOT NULL,
    "prescription_id" BIGINT NOT NULL,
    "product_id" BIGINT,
    "medication_name" TEXT NOT NULL,
    "dosage" TEXT,
    "frequency" TEXT,
    "duration" TEXT,
    "quantity_prescribed" INTEGER,
    "instructions" TEXT,
    "substitution_allowed" BOOLEAN NOT NULL DEFAULT true,
    "matched_product_id" BIGINT,
    "status" "PrescriptionItemStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "idx_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_phone" ON "User"("phone");

-- CreateIndex
CREATE INDEX "idx_user_type" ON "User"("user_type");

-- CreateIndex
CREATE INDEX "idx_status" ON "User"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User2FA_user_id_key" ON "User2FA"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "User2FA"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "idx_token" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "idx_expires" ON "PasswordResetToken"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_user_id_key" ON "CustomerProfile"("user_id");

-- CreateIndex
CREATE INDEX "idx_organization_type" ON "CustomerProfile"("organization_type");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierProfile_user_id_key" ON "SupplierProfile"("user_id");

-- CreateIndex
CREATE INDEX "idx_verification_status" ON "SupplierProfile"("verification_status");

-- CreateIndex
CREATE INDEX "idx_business_type" ON "SupplierProfile"("business_type");

-- CreateIndex
CREATE UNIQUE INDEX "Wilaya_code_key" ON "Wilaya"("code");

-- CreateIndex
CREATE INDEX "idx_wilaya_code" ON "Wilaya"("code");

-- CreateIndex
CREATE INDEX "idx_wilaya_id" ON "Commune"("wilaya_id");

-- CreateIndex
CREATE INDEX "idx_commune_code" ON "Commune"("code");

-- CreateIndex
CREATE INDEX "idx_user_address_id" ON "UserAddress"("user_id");

-- CreateIndex
CREATE INDEX "idx_wilaya_commune" ON "UserAddress"("wilaya_id", "commune_id");

-- CreateIndex
CREATE INDEX "idx_parent_id" ON "Category"("parent_id");

-- CreateIndex
CREATE INDEX "idx_active" ON "Category"("is_active");

-- CreateIndex
CREATE INDEX "idx_sort_order" ON "Category"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "idx_name" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "idx_brand_active" ON "Brand"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "idx_supplier_id" ON "Product"("supplier_id");

-- CreateIndex
CREATE INDEX "idx_category_id" ON "Product"("category_id");

-- CreateIndex
CREATE INDEX "idx_brand_id" ON "Product"("brand_id");

-- CreateIndex
CREATE INDEX "idx_sku" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "idx_product_status" ON "Product"("status");

-- CreateIndex
CREATE INDEX "idx_approval_status" ON "Product"("approval_status");

-- CreateIndex
CREATE INDEX "idx_featured" ON "Product"("featured");

-- CreateIndex
CREATE INDEX "idx_requires_prescription" ON "Product"("requires_prescription");

-- CreateIndex
CREATE INDEX "idx_product_id" ON "ProductImage"("product_id");

-- CreateIndex
CREATE INDEX "idx_review_id" ON "ReviewImage"("review_id");

-- CreateIndex
CREATE INDEX "idx_product_id_review" ON "ProductReview"("product_id");

-- CreateIndex
CREATE INDEX "idx_user_id_review" ON "ProductReview"("user_id");

-- CreateIndex
CREATE INDEX "idx_rating" ON "ProductReview"("rating");

-- CreateIndex
CREATE INDEX "idx_status_review" ON "ProductReview"("status");

-- CreateIndex
CREATE INDEX "idx_verified_purchase" ON "ProductReview"("verified_purchase");

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_user_id_product_id_order_id_key" ON "ProductReview"("user_id", "product_id", "order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");

-- CreateIndex
CREATE INDEX "idx_customer_id" ON "Order"("customer_id");

-- CreateIndex
CREATE INDEX "idx_order_number" ON "Order"("order_number");

-- CreateIndex
CREATE INDEX "idx_status_order" ON "Order"("status");

-- CreateIndex
CREATE INDEX "idx_payment_status" ON "Order"("payment_status");

-- CreateIndex
CREATE INDEX "idx_created_at" ON "Order"("created_at");

-- CreateIndex
CREATE INDEX "idx_review_id_review_vote" ON "ReviewVote"("review_id");

-- CreateIndex
CREATE INDEX "idx_user_id_review_vote" ON "ReviewVote"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_user_id_review_id_key" ON "ReviewVote"("user_id", "review_id");

-- CreateIndex
CREATE INDEX "idx_supplier_id_supplier_rev" ON "SupplierReview"("supplier_id");

-- CreateIndex
CREATE INDEX "idx_customer_id_supplier_rev" ON "SupplierReview"("customer_id");

-- CreateIndex
CREATE INDEX "idx_rating_supplier_rev" ON "SupplierReview"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierReview_customer_id_supplier_id_order_id_key" ON "SupplierReview"("customer_id", "supplier_id", "order_id");

-- CreateIndex
CREATE INDEX "idx_user_id_prescription" ON "Prescription"("user_id");

-- CreateIndex
CREATE INDEX "idx_order_id" ON "Prescription"("order_id");

-- CreateIndex
CREATE INDEX "idx_verification_status_prescription" ON "Prescription"("verification_status");

-- CreateIndex
CREATE INDEX "idx_prescription_number" ON "Prescription"("prescription_number");

-- CreateIndex
CREATE INDEX "idx_prescription_id" ON "PrescriptionItem"("prescription_id");

-- CreateIndex
CREATE INDEX "idx_product_id_prescription_item" ON "PrescriptionItem"("product_id");

-- CreateIndex
CREATE INDEX "idx_status_prescription_item" ON "PrescriptionItem"("status");

-- AddForeignKey
ALTER TABLE "User2FA" ADD CONSTRAINT "User2FA_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierProfile" ADD CONSTRAINT "SupplierProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_wilaya_id_fkey" FOREIGN KEY ("wilaya_id") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_wilaya_id_fkey" FOREIGN KEY ("wilaya_id") REFERENCES "Wilaya"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAddress" ADD CONSTRAINT "UserAddress_commune_id_fkey" FOREIGN KEY ("commune_id") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewImage" ADD CONSTRAINT "ReviewImage_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "UserAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierReview" ADD CONSTRAINT "SupplierReview_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierReview" ADD CONSTRAINT "SupplierReview_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierReview" ADD CONSTRAINT "SupplierReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_matched_product_id_fkey" FOREIGN KEY ("matched_product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
