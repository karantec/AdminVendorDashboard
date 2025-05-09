export const mockVendorStockUpdates = [
  {
    id: "1",
    vendorId: "vendor1",
    vendorName: "John Doe",
    vendorEmail: "john@example.com",
    storeName: "Fresh Groceries",
    submittedAt: new Date("2023-06-15T10:30:00"),
    status: "pending",
    notes: "Seasonal stock adjustment",
    items: [
      {
        id: "item1",
        productId: "prod1",
        productName: "Organic Apples",
        currentStock: 50,
        updatedStock: 75,
        price: 1.99,
        category: "Fruits",
        reason: "Increased demand",
      },
      {
        id: "item2",
        productId: "prod2",
        productName: "Whole Wheat Bread",
        currentStock: 30,
        updatedStock: 20,
        price: 2.49,
        category: "Bakery",
        reason: "Reduced shelf space",
      },
    ],
  },
  {
    id: "2",
    vendorId: "vendor2",
    vendorName: "Jane Smith",
    vendorEmail: "jane@example.com",
    storeName: "Daily Market",
    submittedAt: new Date("2023-06-14T15:45:00"),
    status: "pending",
    items: [
      {
        id: "item3",
        productId: "prod3",
        productName: "Free Range Eggs",
        currentStock: 100,
        updatedStock: 120,
        price: 3.99,
        category: "Dairy",
        reason: "New supplier",
      },
    ],
  },
];
