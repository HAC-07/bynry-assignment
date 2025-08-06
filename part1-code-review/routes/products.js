// routes/products.js
app.post("/api/products", async (req, res) => {
  const { name, sku, price, warehouseId, initialQuantity } = req.body; // takes from user

  try {
    if (!sku || !price || !warehouseId || initialQuantity == null) {
      return res.status(400).json({ message: "Missing required fields" }); //checks every required field is present or not
    }

    const existing = await Product.findOne({ sku });
    if (existing)
      return res.status(409).json({ message: "SKU already exists" }); //checks if sku is already present in products

    const product = await Product.create({ name, sku, price }); //creates product and

    // Check if inventory already exists for this product & warehouse
    const existingInventory = await Inventory.findOne({
      productId: product._id,
      warehouseId,
    });

    if (existingInventory) {
      // Update quantity if inventory record already exists
      existingInventory.quantity += initialQuantity;
      await existingInventory.save();
    } else {
      await Inventory.create({
        // Create new inventory record
        productId: product._id,
        warehouseId,
        quantity: initialQuantity,
      });
    }

    res
      .status(201)
      .json({ message: "Product created", product_id: product._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
