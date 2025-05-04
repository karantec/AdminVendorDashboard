import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import {
  Search,
  FilterList,
  Refresh,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";

// Dummy data
const dummyVendors = [
  {
    id: "1",
    name: "Fresh Mart",
    location: "Downtown",
    rating: 4.5,
    status: "active",
  },
  {
    id: "2",
    name: "Grocery Plus",
    location: "Westside",
    rating: 4.2,
    status: "active",
  },
  {
    id: "3",
    name: "Quick Stop",
    location: "East End",
    rating: 3.9,
    status: "inactive",
  },
  {
    id: "4",
    name: "Urban Pantry",
    location: "North District",
    rating: 4.7,
    status: "pending",
  },
];

const dummyStockUpdates = [
  {
    id: "1",
    vendorId: "1",
    vendorName: "Fresh Mart",
    productName: "Organic Apples",
    category: "Fruits",
    previousStock: 50,
    updatedStock: 70,
    price: 2.99,
    updateType: "increase",
    timestamp: "2023-05-15T10:30:00Z",
    approved: true,
  },
  {
    id: "2",
    vendorId: "1",
    vendorName: "Fresh Mart",
    productName: "Whole Wheat Bread",
    category: "Bakery",
    previousStock: 20,
    updatedStock: 15,
    price: 3.49,
    updateType: "decrease",
    timestamp: "2023-05-15T11:15:00Z",
    approved: false,
  },
  {
    id: "3",
    vendorId: "2",
    vendorName: "Grocery Plus",
    productName: "Free Range Eggs",
    category: "Dairy",
    previousStock: 0,
    updatedStock: 30,
    price: 4.99,
    updateType: "new",
    timestamp: "2023-05-14T09:45:00Z",
    approved: true,
  },
  {
    id: "4",
    vendorId: "3",
    vendorName: "Quick Stop",
    productName: "Mineral Water",
    category: "Beverages",
    previousStock: 100,
    updatedStock: 80,
    price: 1.29,
    updateType: "decrease",
    timestamp: "2023-05-14T16:20:00Z",
    approved: false,
  },
  {
    id: "5",
    vendorId: "4",
    vendorName: "Urban Pantry",
    productName: "Organic Spinach",
    category: "Vegetables",
    previousStock: 25,
    updatedStock: 40,
    price: 3.99,
    updateType: "increase",
    timestamp: "2023-05-13T14:10:00Z",
    approved: true,
  },
];

const ViewVendorStockUpdates = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockUpdates, setStockUpdates] = useState([]);
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [approvalStatus, setApprovalStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch data (simulating API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setVendors(dummyVendors);
        setStockUpdates(dummyStockUpdates);
        setFilteredUpdates(dummyStockUpdates);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...stockUpdates];

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (update) =>
          update.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          update.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Vendor filter
    if (selectedVendor !== "all") {
      result = result.filter((update) => update.vendorId === selectedVendor);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (update) =>
          update.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Approval status filter
    if (approvalStatus !== "all") {
      const status = approvalStatus === "approved";
      result = result.filter((update) => update.approved === status);
    }

    setFilteredUpdates(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    searchTerm,
    selectedVendor,
    selectedCategory,
    approvalStatus,
    stockUpdates,
  ]);

  // Handle sort
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedUpdates = [...filteredUpdates].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setFilteredUpdates(sortedUpdates);
  };

  // Handle approve/reject
  const handleUpdateStatus = (id, action) => {
    const updated = stockUpdates.map((update) => {
      if (update.id === id) {
        return { ...update, approved: action === "approve" };
      }
      return update;
    });

    setStockUpdates(updated);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Pagination
  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage);
  const currentItems = filteredUpdates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique categories
  const categories = Array.from(
    new Set(stockUpdates.map((update) => update.category))
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Stock Updates
      </Typography>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              placeholder="Search products or vendors..."
              InputProps={{ startAdornment: <Search /> }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                label="Vendor"
              >
                <MenuItem value="all">All Vendors</MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Approval Status</InputLabel>
              <Select
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                label="Approval Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm("");
                setSelectedVendor("all");
                setSelectedCategory("all");
                setApprovalStatus("all");
              }}
            >
              Clear Filters
            </Button>

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ ml: "auto" }}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Results count */}
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Showing {filteredUpdates.length} update
            {filteredUpdates.length !== 1 ? "s" : ""}
          </Typography>

          {/* Stock Updates Table */}
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Button onClick={() => requestSort("timestamp")}>
                        Date & Time
                        {sortConfig?.key === "timestamp" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => requestSort("vendorName")}>
                        Vendor
                        {sortConfig?.key === "vendorName" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => requestSort("productName")}>
                        Product
                        {sortConfig?.key === "productName" &&
                          (sortConfig.direction === "ascending" ? (
                            <ArrowUpward fontSize="small" />
                          ) : (
                            <ArrowDownward fontSize="small" />
                          ))}
                      </Button>
                    </TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Previous Stock</TableCell>
                    <TableCell align="right">Updated Stock</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Update Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((update) => (
                      <TableRow key={update.id}>
                        <TableCell>
                          {new Date(update.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{update.vendorName}</TableCell>
                        <TableCell>{update.productName}</TableCell>
                        <TableCell>{update.category}</TableCell>
                        <TableCell align="right">
                          {update.previousStock}
                        </TableCell>
                        <TableCell align="right">
                          {update.updatedStock}
                        </TableCell>
                        <TableCell align="right">
                          ${update.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={update.updateType}
                            color={
                              update.updateType === "increase"
                                ? "success"
                                : update.updateType === "decrease"
                                ? "error"
                                : "info"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={update.approved ? "Approved" : "Pending"}
                            color={update.approved ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {!update.approved && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() =>
                                  handleUpdateStatus(update.id, "approve")
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleUpdateStatus(update.id, "reject")
                                }
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No stock updates found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ViewVendorStockUpdates;
