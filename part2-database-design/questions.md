# Questions to the Product Team (Missing Requirements)

Should threshold be defined per product or per warehouse?
Should Threshold Trigger for Products Inside a Bundle?
Do bundles support multiple levels (bundle inside bundle)?
What constitutes “recent sales” — is there an orders collection?
Can a product be linked to multiple suppliers?
Do we need to track unit types (eg "kg", "litre")?

# Design Decisions
Used ObjectId references to normalize data.
Separate InventoryHistory for full audit trails.
Product.type = 'bundle' to support kits or combos.
Defined threshold at product level (can be customized later).