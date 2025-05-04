import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import { Search, FilterAlt, Clear } from "@mui/icons-material";

// Renamed the interface to avoid naming conflict
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

export const ProductFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ searchQuery: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handlePriceChange = (type, value) => {
    const numValue = value === "" ? null : parseFloat(value);
    onFilterChange(
      type === "min" ? { minPrice: numValue } : { maxPrice: numValue }
    );
  };

  const handleStockChange = (value) => {
    onFilterChange({ inStock: value });
  };

  const handleSortChange = (sortBy) => {
    // Toggle order if same sortBy is clicked
    if (sortBy === filters.sortBy) {
      onFilterChange({
        sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      onFilterChange({ sortBy, sortOrder: "asc" });
    }
  };

  const resetFilters = () => {
    onFilterChange({
      searchQuery: "",
      category: "All",
      minPrice: null,
      maxPrice: null,
      inStock: null,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Filter Products
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="All">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            type="number"
            label="Min Price"
            value={filters.minPrice || ""}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            type="number"
            label="Max Price"
            value={filters.maxPrice || ""}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Stock</InputLabel>
            <Select
              value={filters.inStock === null ? "" : String(filters.inStock)}
              onChange={(e) =>
                handleStockChange(
                  e.target.value === "" ? null : e.target.value === "true"
                )
              }
              label="Stock"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">In Stock</MenuItem>
              <MenuItem value="false">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Button
                variant={filters.sortBy === "name" ? "contained" : "outlined"}
                onClick={() => handleSortChange("name")}
                sx={{ mr: 1 }}
                startIcon={<FilterAlt />}
              >
                Name {filters.sortBy === "name" && `(${filters.sortOrder})`}
              </Button>
              <Button
                variant={filters.sortBy === "price" ? "contained" : "outlined"}
                onClick={() => handleSortChange("price")}
                sx={{ mr: 1 }}
                startIcon={<FilterAlt />}
              >
                Price {filters.sortBy === "price" && `(${filters.sortOrder})`}
              </Button>
              <Button
                variant={filters.sortBy === "stock" ? "contained" : "outlined"}
                onClick={() => handleSortChange("stock")}
                sx={{ mr: 1 }}
                startIcon={<FilterAlt />}
              >
                Stock {filters.sortBy === "stock" && `(${filters.sortOrder})`}
              </Button>
            </Box>
            <Button
              variant="outlined"
              color="error"
              onClick={resetFilters}
              startIcon={<Clear />}
            >
              Reset Filters
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
