-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT,
    "supplier_id" BIGINT NOT NULL,
    "change_quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_product_inventory_log" ON "InventoryLog"("product_id");

-- CreateIndex
CREATE INDEX "idx_variant_inventory_log" ON "InventoryLog"("variant_id");

-- CreateIndex
CREATE INDEX "idx_supplier_inventory_log" ON "InventoryLog"("supplier_id");

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
