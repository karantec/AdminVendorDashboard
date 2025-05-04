import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  FilterList,
  Sort,
  Visibility,
  Print,
  Download,
  Close,
} from "@mui/icons-material";

// Mock data for development
const generateMockOrders = () => {
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const paymentMethods = [
    "credit_card",
    "debit_card",
    "paypal",
    "cash_on_delivery",
  ];
  const paymentStatuses = ["paid", "pending", "failed"];
  const storeNames = [
    "Fresh Mart",
    "Organic Valley",
    "City Grocers",
    "Quick Stop",
    "Family Market",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    let deliveryDate = null;

    if (status === "delivered") {
      const tempDate = new Date(orderDate);
      tempDate.setDate(tempDate.getDate() + Math.floor(Math.random() * 3) + 1);
      deliveryDate = tempDate.toISOString();
    }

    const items = Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, j) => ({
        id: `item-${i}-${j}`,
        name: [
          "Milk",
          "Bread",
          "Eggs",
          "Cheese",
          "Apples",
          "Bananas",
          "Chicken",
          "Rice",
        ][Math.floor(Math.random() * 8)],
        quantity: Math.floor(Math.random() * 5) + 1,
        price: parseFloat((Math.random() * 20 + 1).toFixed(2)),
        total: 0, // Will calculate below
      })
    );

    // Calculate totals
    items.forEach((item) => {
      item.total = item.quantity * item.price;
    });

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const tax = parseFloat((subtotal * 0.08).toFixed(2));
    const deliveryFee = parseFloat((Math.random() * 10 + 1).toFixed(2));
    const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

    return {
      id: `order-${1000 + i}`,
      userId: `user-${100 + i}`,
      customerName: [
        "John Doe",
        "Jane Smith",
        "Robert Brown",
        "Lisa Johnson",
        "Michael Davis",
      ][Math.floor(Math.random() * 5)],
      storeId: `store-${i % 5}`,
      storeName: storeNames[i % 5],
      orderDate: orderDate.toISOString(),
      deliveryDate,
      status,
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus:
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      items,
      subtotal,
      tax,
      deliveryFee,
      total,
      address: {
        street: `${1000 + Math.floor(Math.random() * 1000)} Main St`,
        city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
          Math.floor(Math.random() * 5)
        ],
        state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
        zipCode: `${10000 + Math.floor(Math.random() * 90000)}`,
      },
      notes: Math.random() > 0.7 ? "Please leave at the front door" : "",
    };
  });
};

// Status color mapping for visual indication
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#FFA500"; // Orange
    case "processing":
      return "#3498DB"; // Blue
    case "shipped":
      return "#9B59B6"; // Purple
    case "delivered":
      return "#2ECC71"; // Green
    case "cancelled":
      return "#E74C3C"; // Red
    default:
      return "#95A5A6"; // Grey
  }
};

// Payment status color mapping
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "#2ECC71"; // Green
    case "pending":
      return "#FFA500"; // Orange
    case "failed":
      return "#E74C3C"; // Red
    default:
      return "#95A5A6"; // Grey
  }
};

// Format date string to readable format
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Main component
const ViewAllOrders = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("orderDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch data (using mock data for now)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/orders');
        // const data = await response.json();

        // Using mock data for development
        const mockData = generateMockOrders();

        // Simulate network delay
        setTimeout(() => {
          setOrders(mockData);
          setFilteredOrders(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower) ||
          order.storeName.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      result = result.filter(
        (order) => order.paymentStatus === paymentStatusFilter
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      result = result.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }

      // Handle date comparison
      if (sortField === "orderDate" || sortField === "deliveryDate") {
        const dateA = fieldA ? new Date(fieldA).getTime() : 0;
        const dateB = fieldB ? new Date(fieldB).getTime() : 0;

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

    setFilteredOrders(result);
  }, [
    orders,
    search,
    statusFilter,
    paymentStatusFilter,
    dateRange,
    sortField,
    sortDirection,
  ]);

  // Calculate pagination
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle row click to view details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetailsDialog(true);
  };

  // Handle filter dialog
  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const applyFilters = () => {
    setOpenFilterDialog(false);
    // Filters are already applied through useEffect
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentStatusFilter("all");
    setDateRange({ start: "", end: "" });
    setSearch("");
    setOpenFilterDialog(false);
  };

  // Handle export functions
  const exportToPDF = () => {
    setSnackbar({
      open: true,
      message: "Export to PDF feature will be implemented in the next phase",
      severity: "info",
    });
  };

  const exportToCSV = () => {
    setSnackbar({
      open: true,
      message: "Export to CSV feature will be implemented in the next phase",
      severity: "info",
    });
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // If loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading orders...
        </Typography>
      </Box>
    );
  }

  // If error
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          All Orders
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Print />}
            sx={{ mr: 1 }}
            onClick={exportToPDF}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearch("")}>
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        <FormControl size="small" sx={{ minWidth: "150px" }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={handleOpenFilterDialog}
        >
          More Filters
        </Button>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ display: "flex", mb: 3, gap: 2, flexWrap: "wrap" }}>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: "150px" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total Orders
          </Typography>
          <Typography variant="h5">{orders.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: "150px" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Pending Orders
          </Typography>
          <Typography variant="h5">
            {orders.filter((order) => order.status === "pending").length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: "150px" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Processing Orders
          </Typography>
          <Typography variant="h5">
            {orders.filter((order) => order.status === "processing").length}
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flexGrow: 1, minWidth: "150px" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Delivered Orders
          </Typography>
          <Typography variant="h5">
            {orders.filter((order) => order.status === "delivered").length}
          </Typography>
        </Paper>
      </Box>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("id")}
                >
                  Order ID
                  {sortField === "id" && (
                    <Sort
                      sx={{
                        fontSize: 18,
                        transform:
                          sortDirection === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("customerName")}
                >
                  Customer
                  {sortField === "customerName" && (
                    <Sort
                      sx={{
                        fontSize: 18,
                        transform:
                          sortDirection === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("storeName")}
                >
                  Store
                  {sortField === "storeName" && (
                    <Sort
                      sx={{
                        fontSize: 18,
                        transform:
                          sortDirection === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("orderDate")}
                >
                  Order Date
                  {sortField === "orderDate" && (
                    <Sort
                      sx={{
                        fontSize: 18,
                        transform:
                          sortDirection === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Payment</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("total")}
                >
                  Total
                  {sortField === "total" && (
                    <Sort
                      sx={{
                        fontSize: 18,
                        transform:
                          sortDirection === "desc" ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    cursor: "pointer",
                  }}
                  onClick={() => handleViewDetails(order)}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.storeName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      }
                      sx={{
                        backgroundColor: getStatusColor(order.status),
                        color: "white",
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        order.paymentStatus.charAt(0).toUpperCase() +
                        order.paymentStatus.slice(1)
                      }
                      sx={{
                        backgroundColor: getPaymentStatusColor(
                          order.paymentStatus
                        ),
                        color: "white",
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Visibility />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(order);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="subtitle1" sx={{ py: 5 }}>
                    No orders found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{" "}
          {Math.min(filteredOrders.length, (page - 1) * rowsPerPage + 1)} to{" "}
          {Math.min(filteredOrders.length, page * rowsPerPage)} of{" "}
          {filteredOrders.length} orders
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControl size="small" sx={{ mr: 2, minWidth: "100px" }}>
            <InputLabel id="rows-per-page-label">Per Page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Per Page"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1); // Reset to first page when changing rows per page
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Order Details - {selectedOrder.id}
                </Typography>
                <IconButton onClick={() => setOpenDetailsDialog(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Information
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Status
                    </Typography>
                    <Chip
                      label={
                        selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)
                      }
                      sx={{
                        backgroundColor: getStatusColor(selectedOrder.status),
                        color: "white",
                        mt: 1,
                      }}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Chip
                      label={
                        selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                        selectedOrder.paymentStatus.slice(1)
                      }
                      sx={{
                        backgroundColor: getPaymentStatusColor(
                          selectedOrder.paymentStatus
                        ),
                        color: "white",
                        mt: 1,
                      }}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {formatDate(selectedOrder.orderDate)}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Delivery Date
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {formatDate(selectedOrder.deliveryDate)}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {selectedOrder.paymentMethod
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </Typography>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Store
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {selectedOrder.storeName}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Customer Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customerName}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Customer ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.userId}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="body2" color="text.secondary">
                        Delivery Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.address.street},{" "}
                        {selectedOrder.address.city},{" "}
                        {selectedOrder.address.state}{" "}
                        {selectedOrder.address.zipCode}
                      </Typography>
                    </div>

                    {selectedOrder.notes && (
                      <div>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.notes}
                        </Typography>
                      </div>
                    )}
                  </Box>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Order Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Quantity
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Subtotal
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          ${selectedOrder.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          Tax
                        </TableCell>
                        <TableCell>${selectedOrder.tax.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          Delivery Fee
                        </TableCell>
                        <TableCell>
                          ${selectedOrder.deliveryFee.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="right"
                          sx={{ fontWeight: "bold" }}
                        >
                          Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          ${selectedOrder.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSnackbar({
                    open: true,
                    message:
                      "Order actions will be implemented in the next phase",
                    severity: "info",
                  });
                  setOpenDetailsDialog(false);
                }}
              >
                Take Action
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Advanced Filters</Typography>
            <IconButton onClick={handleCloseFilterDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: "400px",
              pt: 1,
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="payment-status-filter-label">
                Payment Status
              </InputLabel>
              <Select
                labelId="payment-status-filter-label"
                value={paymentStatusFilter}
                label="Payment Status"
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Payment Statuses</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="body2" gutterBottom>
                Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                <TextField
                  label="End Date"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters}>Reset All</Button>
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewAllOrders;
