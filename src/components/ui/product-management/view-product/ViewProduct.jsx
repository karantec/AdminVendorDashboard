import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { ProductTable } from "./ProductTable";
import { ProductFilters } from "./ProductFilter";
import { ProductActions } from "./ProductActions";

// Dummy data generator
const generateDummyProducts = (count) => {
  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Meat & Seafood",
    "Bakery",
    "Frozen Foods",
    "Snacks",
    "Beverages",
    "Household",
    "Other",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: `Product ${i + 1}`,
    description: `This is a sample description for Product ${i + 1}`,
    price: parseFloat((Math.random() * 100).toFixed(2)),
    category: categories[Math.floor(Math.random() * categories.length)],
    stock: Math.floor(Math.random() * 100),
    storeId: `store-${Math.floor(Math.random() * 5) + 1}`,
    storeName: `Store ${Math.floor(Math.random() * 5) + 1}`,
    imageUrl: `https://source.unsplash.com/random/200x200/?grocery,${i}`,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
    updatedAt: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000
    ),
    isActive: Math.random() > 0.2,
  }));
};

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "All",
    minPrice: null,
    maxPrice: null,
    inStock: null,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Fetch products (using dummy data for now)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const dummyProducts = generateDummyProducts(50);
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Search by name or description
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (filters.category !== "All") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== null) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }

    // Filter by stock availability
    if (filters.inStock !== null) {
      result = result.filter((p) =>
        filters.inStock ? p.stock > 0 : p.stock === 0
      );
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "stock":
          comparison = a.stock - b.stock;
          break;
        case "createdAt":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedProducts(checked ? filteredProducts.map((p) => p.id) : []);
  };

  const handleBulkAction = (action) => {
    // In a real app, this would be an API call
    console.log(`Performing ${action} on selected products`, selectedProducts);
    alert(`Bulk ${action} action would be performed here in a real app`);
    setSelectedProducts([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <ProductActions
          selectedCount={selectedProducts.length}
          onBulkAction={handleBulkAction}
        />
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductTable
          products={filteredProducts}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onSelectAll={handleSelectAll}
        />
      )}
    </Box>
  );
};

export default ViewProducts;
