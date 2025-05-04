import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Refresh
} from '@mui/icons-material';
import { styled } from '@mui/system';

// Types
interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
}

// Styled components
const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '24px',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const ActionBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  gap: '16px',
});

const StatusChip = styled(Chip)<{ status: Vendor['status'] }>(({ theme, status }) => {
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


// Dummy data
const dummyVendors: Vendor[] = [
  {
    id: '1',
    name: 'Fresh Mart',
    email: 'freshmart@example.com',
    phone: '+1 234 567 8901',
    storeName: 'Fresh Mart Supermarket',
    address: '123 Main St, Anytown, USA',
    status: 'active',
    joinDate: '2023-01-15',
    lastActive: '2023-06-20',
  },
  {
    id: '2',
    name: 'Quick Grocery',
    email: 'quickgrocery@example.com',
    phone: '+1 345 678 9012',
    storeName: 'Quick Grocery Store',
    address: '456 Oak Ave, Somewhere, USA',
    status: 'inactive',
    joinDate: '2023-02-10',
    lastActive: '2023-05-15',
  },
  {
    id: '3',
    name: 'Organic Delights',
    email: 'organic@example.com',
    phone: '+1 456 789 0123',
    storeName: 'Organic Delights Market',
    address: '789 Pine Rd, Nowhere, USA',
    status: 'pending',
    joinDate: '2023-03-05',
    lastActive: '2023-06-18',
  },
  {
    id: '4',
    name: 'Corner Store',
    email: 'cornerstore@example.com',
    phone: '+1 567 890 1234',
    storeName: 'Neighborhood Corner Store',
    address: '321 Elm St, Anywhere, USA',
    status: 'active',
    joinDate: '2023-01-28',
    lastActive: '2023-06-19',
  },
  {
    id: '5',
    name: 'Bulk Foods',
    email: 'bulkfoods@example.com',
    phone: '+1 678 901 2345',
    storeName: 'Bulk Foods Warehouse',
    address: '654 Maple Dr, Everywhere, USA',
    status: 'active',
    joinDate: '2023-04-12',
    lastActive: '2023-06-21',
  },
];

const VendorAccountManagement: React.FC = () => {
  const theme = useTheme();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 5;

  // Fetch vendors (simulating API call)
  useEffect(() => {
    const fetchVendors = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setVendors(dummyVendors);
        setLoading(false);
      }, 1000);
    };

    fetchVendors();
  }, []);

  // Handle search
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedVendors = filteredVendors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Menu actions
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vendorId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendorId(vendorId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVendorId(null);
  };

  const handleEdit = () => {
    const vendor = vendors.find(v => v.id === selectedVendorId);
    if (vendor) {
      setCurrentVendor(vendor);
      setIsEditMode(true);
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setVendors(vendors.filter(v => v.id !== selectedVendorId));
    setSnackbarMessage('Vendor deleted successfully');
    setSnackbarOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (newStatus: Vendor['status']) => {
    setVendors(vendors.map(v =>
      v.id === selectedVendorId ? { ...v, status: newStatus } : v
    ));
    setSnackbarMessage(`Vendor status updated to ${newStatus}`);
    setSnackbarOpen(true);
    handleMenuClose();
  };

  // Dialog handlers
  const handleDialogOpen = () => {
    setCurrentVendor(null);
    setIsEditMode(false);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentVendor(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentVendor) {
      setCurrentVendor({ ...currentVendor, [name]: value });
    } else {
      setCurrentVendor({
        id: '',
        name: '',
        email: '',
        phone: '',
        storeName: '',
        address: '',
        status: 'pending',
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        [name]: value
      } as Vendor);
    }
  };

  const handleSubmit = () => {
    if (isEditMode && currentVendor) {
      setVendors(vendors.map(v => v.id === currentVendor.id ? currentVendor : v));
      setSnackbarMessage('Vendor updated successfully');
    } else if (currentVendor) {
      const newVendor = {
        ...currentVendor,
        id: (vendors.length + 1).toString(),
      };
      setVendors([...vendors, newVendor]);
      setSnackbarMessage('Vendor added successfully');
    }
    setSnackbarOpen(true);
    handleDialogClose();
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbarMessage('Vendor list refreshed');
      setSnackbarOpen(true);
    }, 1000);
  };

  return (
    <PageContainer>
      <Header>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Manage Vendor Accounts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleDialogOpen}
        >
          Add Vendor
        </Button>
      </Header>

      <ActionBar>
        <TextField
          variant="outlined"
          placeholder="Search vendors..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: '300px' }}
        />
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </ActionBar>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Store Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedVendors.length > 0 ? (
                  paginatedVendors.map((vendor) => (
                    <TableRow key={vendor.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>{vendor.name.charAt(0)}</Avatar>
                          <Box>
                            <Typography fontWeight="500">{vendor.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {vendor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{vendor.storeName}</TableCell>
                      <TableCell>{vendor.phone}</TableCell>
                      <TableCell>
                        <StatusChip
                          label={vendor.status}
                          className={vendor.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{vendor.joinDate}</TableCell>
                      <TableCell>{vendor.lastActive}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, vendor.id)}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No vendors found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredVendors.length > 0 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(filteredVendors.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Vendor Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Vendor Account' : 'Add New Vendor'}
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3} py={2}>
            <TextField
              label="Vendor Name"
              name="name"
              value={currentVendor?.name || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Store Name"
              name="storeName"
              value={currentVendor?.storeName || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={currentVendor?.email || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={currentVendor?.phone || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Address"
              name="address"
              value={currentVendor?.address || ''}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              required
            />
            {isEditMode && (
              <TextField
                label="Status"
                name="status"
                value={currentVendor?.status || ''}
                onChange={handleInputChange}
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </TextField>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('active')}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} color="success" />
          Set Active
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('inactive')}>
          <Cancel fontSize="small" sx={{ mr: 1 }} color="error" />
          Set Inactive
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete fontSize="small" sx={{ mr: 1 }} color="error" />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </PageContainer>
  );
};

export default VendorAccountManagement;