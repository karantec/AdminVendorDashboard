import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  InputAdornment,
  Pagination,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Search, Add, MoreVert, Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";

const PageContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "24px",
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
});

const ActionBar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  gap: "16px",
});

const StatusChip = styled(Chip)(({ theme, status }) => {
  const statusStyles = {
    active: {
      backgroundColor: theme.palette.success.light,
      color: theme.palette.success.dark,
    },
    inactive: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.dark,
    },
    pending: {
      backgroundColor: theme.palette.warning.light,
      color: theme.palette.warning.dark,
    },
  };

  return {
    fontWeight: 500,
    ...statusStyles[status],
  };
});

const dummyVendors = [
  {
    id: "1",
    name: "Fresh Mart",
    email: "fresh@example.com",
    phone: "123",
    storeName: "Fresh Mart Supermarket",
    address: "Addr1",
    status: "active",
    joinDate: "2023-01-01",
    lastActive: "2023-05-01",
  },
  {
    id: "2",
    name: "Quick Grocery",
    email: "quick@example.com",
    phone: "234",
    storeName: "Quick Grocery",
    address: "Addr2",
    status: "inactive",
    joinDate: "2023-01-01",
    lastActive: "2023-05-01",
  },
];

const VendorAccountManagement = () => {
  const theme = useTheme();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVendors(dummyVendors);
      setLoading(false);
    }, 1000);
  }, []);

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const openMenu = (e, id) => {
    setAnchorEl(e.currentTarget);
    setSelectedVendorId(id);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedVendorId(null);
  };

  const handleEdit = () => {
    const vendor = vendors.find((v) => v.id === selectedVendorId);
    if (vendor) {
      setCurrentVendor(vendor);
      setIsEditMode(true);
      setOpenDialog(true);
    }
    closeMenu();
  };

  const handleDelete = () => {
    setVendors(vendors.filter((v) => v.id !== selectedVendorId));
    setSnackbarMessage("Deleted");
    setSnackbarOpen(true);
    closeMenu();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentVendor(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditMode && currentVendor) {
      setVendors(
        vendors.map((v) => (v.id === currentVendor.id ? currentVendor : v))
      );
      setSnackbarMessage("Updated");
    } else if (currentVendor) {
      const newVendor = {
        ...currentVendor,
        id: (vendors.length + 1).toString(),
      };
      setVendors([...vendors, newVendor]);
      setSnackbarMessage("Added");
    }
    setSnackbarOpen(true);
    handleDialogClose();
  };

  return (
    <PageContainer>
      <Header>
        <Typography variant="h4">Manage Vendors</Typography>
        <Button
          onClick={() => {
            setOpenDialog(true);
            setIsEditMode(false);
            setCurrentVendor({
              id: "",
              name: "",
              email: "",
              phone: "",
              storeName: "",
              address: "",
              status: "pending",
              joinDate: "",
              lastActive: "",
            });
          }}
          startIcon={<Add />}
          variant="contained"
        >
          Add
        </Button>
      </Header>

      <ActionBar>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </ActionBar>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{vendor.name.charAt(0)}</Avatar>
                        {vendor.name}
                      </Box>
                    </TableCell>
                    <TableCell>{vendor.storeName}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>
                      <StatusChip
                        status={vendor.status}
                        label={vendor.status}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => openMenu(e, vendor.id)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(filtered.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>{isEditMode ? "Edit" : "Add"} Vendor</DialogTitle>
        <DialogContent>
          {["name", "email", "phone", "storeName", "address"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={currentVendor?.[field] || ""}
              onChange={handleInputChange}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </PageContainer>
  );
};

export default VendorAccountManagement;
