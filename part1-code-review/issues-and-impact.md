Part 1: Code Review & Debugging (30 minutes)
A previous intern wrote this API endpoint for adding new products. Something is wrong - the code compiles but doesn't work as expected in production.
@app.route('/api/products', methods=['POST'])
def create_product():
data = request.json
# Create new product
product = Product(
name=data['name'],
sku=data['sku'],
price=data['price'],
warehouse_id=data['warehouse_id']
)
db.session.add(product)
db.session.commit()
# Update inventory count
inventory = Inventory(
product_id=product.id,
warehouse_id=data['warehouse_id'],
quantity=data['initial_quantity']
)
db.session.add(inventory)
db.session.commit()
return {"message": "Product created", "product_id": product.id}


# This section contains the corrected implementation of the broken Flask API using Express.js and Mongoose (Node.js / MERN stack approach).

1. sku not checked for uniqueness
Impact: Duplicate SKUs can be inserted, leading to product listing conflicts, incorrect inventory counts, and inaccurate sales reports.
Real-world result: Breaks product identification across the platform. May also violate DB constraints if uniqueness is enforced.

2. Doesn't check if warehouse_id exists
Impact: Products can be assigned to a non-existent warehouse, causing orphaned inventory records.
Real-world result: Leads to data inconsistency, broken dashboards, and warehouse teams unable to locate inventory.

3. initial_quantity accessed directly without validation
Impact: If the field is missing or invalid in the request, the server throws an error or stores None.
Real-world result: App crashes or product gets created with no usable inventory, causing operational confusion.

4. No rollback if inventory creation fails
Impact: If inventory creation fails after product creation, the product remains in the database without inventory.
Real-world result: Partial/inconsistent data; inventory reports are inaccurate, and debugging becomes difficult.

5. price may be a string or invalid
Impact: No validation means prices like "ten rupees" or -10 might get stored.
Real-world result: Causes billing or reporting errors.

6. No input validation (types, mandatory fields, range checks)
Impact: Allows bad or malformed data into the system.
Real-world result: Leads to system crashes, invalid product entries.