import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  WatchLater,
} from "@mui/icons-material";

// Dummy data
const dummyVendors = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    storeName: "Fresh Mart",
    storeLocation: "Downtown",
    registrationDate: "2023-05-15",
    status: "pending",
    avatar: "",
    phone: "+1234567890",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    storeName: "Organic Corner",
    storeLocation: "Uptown",
    registrationDate: "2023-05-10",
    status: "approved",
    avatar: "",
    phone: "+9876543210",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    storeName: "Quick Grocery",
    storeLocation: "Midtown",
    registrationDate: "2023-05-05",
    status: "rejected",
    avatar: "",
    phone: "+1122334455",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    storeName: "Daily Needs",
    storeLocation: "Suburb",
    registrationDate: "2023-05-01",
    status: "pending",
    avatar: "",
    phone: "+5566778899",
  },
];

const VendorLoginApproval = () => {
  // State
  const [vendors, setVendors] = useState(dummyVendors);
  const [filteredVendors, setFilteredVendors] = useState(dummyVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter vendors based on search and status
  useEffect(() => {
    let result = vendors;

    if (searchTerm) {
      result = result.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((vendor) => vendor.status === statusFilter);
    }

    setFilteredVendors(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, vendors]);

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Get current vendors for the page
  const currentVendors = filteredVendors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Handle vendor action (approve/reject)
  const handleAction = (vendor, action) => {
    setSelectedVendor(vendor);
    setDialogAction(action);
    setOpenDialog(true);
  };

  // Confirm action
  const confirmAction = () => {
    if (!selectedVendor || !dialogAction) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedVendors = vendors.map((vendor) => {
        if (vendor.id === selectedVendor.id) {
          return {
            ...vendor,
            status: dialogAction === "approve" ? "approved" : "rejected",
          };
        }
        return vendor;
      });

      setVendors(updatedVendors);
      setLoading(false);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: `Vendor ${
          dialogAction === "approve" ? "approved" : "rejected"
        } successfully!`,
        severity: "success",
      });
    }, 1000);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVendor(null);
    setDialogAction(null);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Get status chip color
  const getStatusChipColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle fontSize="small" />;
      case "rejected":
        return <Cancel fontSize="small" />;
      case "pending":
        return <WatchLater fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Login Approval
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Review and manage vendor access to the portal
      </Typography>

      {/* Filters and Search */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FilterList color="action" />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Vendors Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Store Details</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentVendors.length > 0 ? (
              currentVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar alt={vendor.name} src={vendor.avatar} />
                      <Box>
                        <Typography fontWeight="medium">
                          {vendor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vendor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {vendor.storeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.storeLocation}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{vendor.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(vendor.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        vendor.status.charAt(0).toUpperCase() +
                        vendor.status.slice(1)
                      }
                      color={getStatusChipColor(vendor.status)}
                      icon={getStatusIcon(vendor.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {vendor.status === "pending" && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleAction(vendor, "approve")}
                          startIcon={<CheckCircle />}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleAction(vendor, "reject")}
                          startIcon={<Cancel />}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    {vendor.status !== "pending" && (
                      <Typography variant="body2" color="text.secondary">
                        Action completed
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No vendors found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredVendors.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(filteredVendors.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogAction === "approve"
            ? "Approve Vendor Access"
            : "Reject Vendor Access"}
        </DialogTitle>
        <DialogContent>
          {selectedVendor && (
            <Typography>
              {dialogAction === "approve"
                ? `Approve ${selectedVendor.name}'s access to the vendor portal?`
                : `Reject ${selectedVendor.name}'s application for vendor portal access?`}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            color={dialogAction === "approve" ? "success" : "error"}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading
              ? "Processing..."
              : dialogAction === "approve"
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorLoginApproval;
