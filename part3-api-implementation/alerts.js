// Assumptions
// Recent sales = sales in last 30 days
// Sales stored in a Sales collection
// Threshold is per product
// Bundles are ignored in alerts

const express = require("express");
const app = express();
app.use(express.json());

//sample data for testing api in postman
const warehouses = [
  { _id: "w1", name: "Main Warehouse", companyId: "c1" },
  { _id: "w2", name: "Backup Warehouse", companyId: "c1" }
];

const products = [
  { _id: "p1", name: "Widget A", sku: "WID-001", threshold: 20 },
  { _id: "p2", name: "Widget B", sku: "WID-002", threshold: 10 }
];

const inventories = [
  { productId: "p1", warehouseId: "w1", quantity: 5 },
  { productId: "p2", warehouseId: "w2", quantity: 15 }
];

const sales = [
  { productId: "p1", warehouseId: "w1", quantity: 30, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }, // 5 days ago
  { productId: "p1", warehouseId: "w1", quantity: 30, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }, // 15 days ago
  { productId: "p2", warehouseId: "w2", quantity: 20, date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) }  // 25 days ago
];

const productSuppliers = [
  {
    productId: "p1",
    supplier: {
      _id: "s1",
      name: "Supplier Corp",
      email: "orders@supplier.com"
    }
  }
];

app.get("/api/companies/:companyId/alerts/low-stock", async (req, res) => {
  const { companyId } = req.params;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Filter warehouses by company
    const companyWarehouses = warehouses.filter(w => w.companyId === companyId);
    const warehouseIds = companyWarehouses.map(w => w._id);

    // Get products with recent sales
    const recentSalesProductIds = [...new Set(
      sales.filter(s => warehouseIds.includes(s.warehouseId) && s.date >= thirtyDaysAgo)
           .map(s => s.productId)
    )];

    const relevantInventories = inventories.filter(inv =>
      recentSalesProductIds.includes(inv.productId) &&
      warehouseIds.includes(inv.warehouseId)
    );

    const alerts = [];

    for (const inv of relevantInventories) {
      const product = products.find(p => p._id === inv.productId);
      const warehouse = warehouses.find(w => w._id === inv.warehouseId);
      const threshold = product.threshold || 20;

      if (inv.quantity < threshold) {
        // Calculate average daily sale in last 30 days
        const productSales = sales.filter(s =>
          s.productId === product._id &&
          s.date >= thirtyDaysAgo
        );

        const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
        const avgPerDay = totalSold / 30;
        const daysLeft = avgPerDay > 0 ? Math.ceil(inv.quantity / avgPerDay) : null;

        const supplierLink = productSuppliers.find(link => link.productId === product._id);

        alerts.push({
          product_id: product._id,
          product_name: product.name,
          sku: product.sku,
          warehouse_id: warehouse._id,
          warehouse_name: warehouse.name,
          current_stock: inv.quantity,
          threshold,
          days_until_stockout: daysLeft,
          supplier: supplierLink
            ? {
                id: supplierLink.supplier._id,
                name: supplierLink.supplier.name,
                contact_email: supplierLink.supplier.email
              }
            : null
        });
      }
    }

    res.json({ alerts, total_alerts: alerts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving low stock alerts" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
