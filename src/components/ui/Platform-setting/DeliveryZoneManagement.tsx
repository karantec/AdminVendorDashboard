import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Types for our data models
interface DeliveryZone {
  id: string;
  name: string;
  radius: number;
  status: 'active' | 'inactive';
  minOrderValue: number;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  storeId: string;
  zipCodes: string[];
  createdAt: string;
  updatedAt: string;
}

interface Store {
  id: string;
  name: string;
}

// Mock data for development
const mockStores: Store[] = [
  { id: 'store1', name: 'Fresh Mart' },
  { id: 'store2', name: 'Super Grocery' },
  { id: 'store3', name: 'Quick Goods' },
  { id: 'store4', name: 'City Market' },
  { id: 'store5', name: 'Neighborhood Grocery' },
];

const mockDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone1',
    name: 'Downtown Area',
    radius: 5,
    status: 'active',
    minOrderValue: 15,
    deliveryFee: 3.99,
    estimatedDeliveryTime: '15-30 min',
    storeId: 'store1',
    zipCodes: ['10001', '10002', '10003'],
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z'
  },
  {
    id: 'zone2',
    name: 'Uptown',
    radius: 7,
    status: 'active',
    minOrderValue: 20,
    deliveryFee: 4.99,
    estimatedDeliveryTime: '20-40 min',
    storeId: 'store2',
    zipCodes: ['10010', '10011', '10012'],
    createdAt: '2024-12-02T11:00:00Z',
    updatedAt: '2025-01-16T08:45:00Z'
  },
  {
    id: 'zone3',
    name: 'Suburb Zone',
    radius: 10,
    status: 'inactive',
    minOrderValue: 25,
    deliveryFee: 5.99,
    estimatedDeliveryTime: '30-50 min',
    storeId: 'store3',
    zipCodes: ['10020', '10021', '10022'],
    createdAt: '2024-12-03T12:00:00Z',
    updatedAt: '2025-01-17T10:15:00Z'
  },
  {
    id: 'zone4',
    name: 'Business District',
    radius: 3,
    status: 'active',
    minOrderValue: 10,
    deliveryFee: 2.99,
    estimatedDeliveryTime: '10-20 min',
    storeId: 'store1',
    zipCodes: ['10030', '10031'],
    createdAt: '2024-12-04T13:00:00Z',
    updatedAt: '2025-01-18T11:30:00Z'
  },
  {
    id: 'zone5',
    name: 'West Side',
    radius: 8,
    status: 'active',
    minOrderValue: 18,
    deliveryFee: 4.49,
    estimatedDeliveryTime: '25-45 min',
    storeId: 'store4',
    zipCodes: ['10040', '10041', '10042', '10043'],
    createdAt: '2024-12-05T14:00:00Z',
    updatedAt: '2025-01-19T12:45:00Z'
  },
];

// Main Component
const DeliveryZoneManagement: React.FC = () => {
  // State for the delivery zones data
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // State for dialogs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  // State for form
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    name: '',
    radius: 5,
    status: 'active',
    minOrderValue: 15,
    deliveryFee: 3.99,
    estimatedDeliveryTime: '15-30 min',
    storeId: '',
    zipCodes: []
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Fetch data (simulated)
  useEffect(() => {
    // This simulates loading data from an API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from your backend API
        setDeliveryZones(mockDeliveryZones);
        setStores(mockStores);
        setLoading(false);
      } catch (err) {
        setError('Failed to load delivery zones data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter delivery zones based on search term and filters
  const filteredDeliveryZones = deliveryZones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.zipCodes.some(zip => zip.includes(searchTerm));
    
    const matchesStore = storeFilter === 'all' || zone.storeId === storeFilter;
    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter;
    
    return matchesSearch && matchesStore && matchesStatus;
  });

  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialog handlers
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      radius: 5,
      status: 'active',
      minOrderValue: 15,
      deliveryFee: 3.99,
      estimatedDeliveryTime: '15-30 min',
      storeId: stores[0]?.id || '',
      zipCodes: []
    });
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (zone: DeliveryZone) => {
    setSelectedZone(zone);
    setFormData({ ...zone });
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = (zone: DeliveryZone) => {
    setSelectedZone(zone);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
    setSelectedZone(null);
    setFormData({
      name: '',
      radius: 5,
      status: 'active',
      minOrderValue: 15,
      deliveryFee: 3.99,
      estimatedDeliveryTime: '15-30 min',
      storeId: '',
      zipCodes: []
    });
  };

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStatusChange = () => {
    setFormData({
      ...formData,
      status: formData.status === 'active' ? 'inactive' : 'active'
    });
  };

  const handleZipCodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zipCodesString = e.target.value;
    const zipCodesArray = zipCodesString.split(',').map(zip => zip.trim());
    setFormData({
      ...formData,
      zipCodes: zipCodesArray
    });
  };

  // CRUD operations
  const handleAddZone = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.storeId) {
        setSnackbar({
          open: true,
          message: 'Please fill all required fields',
          severity: 'error'
        });
        return;
      }

      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate a new zone
      const newZone: DeliveryZone = {
        id: `zone${deliveryZones.length + 1}`,
        name: formData.name || '',
        radius: formData.radius || 5,
        status: formData.status as 'active' | 'inactive' || 'active',
        minOrderValue: formData.minOrderValue || 15,
        deliveryFee: formData.deliveryFee || 3.99,
        estimatedDeliveryTime: formData.estimatedDeliveryTime || '15-30 min',
        storeId: formData.storeId || '',
        zipCodes: formData.zipCodes || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update state with new zone
      setDeliveryZones([...deliveryZones, newZone]);
      setLoading(false);
      
      // Close dialog and show success notification
      handleCloseDialogs();
      setSnackbar({
        open: true,
        message: 'Delivery zone added successfully',
        severity: 'success'
      });
    } catch (err) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to add delivery zone',
        severity: 'error'
      });
    }
  };

  const handleEditZone = async () => {
    try {
      if (!selectedZone || !formData.name || !formData.storeId) {
        setSnackbar({
          open: true,
          message: 'Please fill all required fields',
          severity: 'error'
        });
        return;
      }

      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the zone
      const updatedZones = deliveryZones.map(zone => 
        zone.id === selectedZone.id 
          ? { 
              ...zone, 
              ...formData, 
              updatedAt: new Date().toISOString() 
            } as DeliveryZone
          : zone
      );

      setDeliveryZones(updatedZones);
      setLoading(false);
      
      // Close dialog and show success notification
      handleCloseDialogs();
      setSnackbar({
        open: true,
        message: 'Delivery zone updated successfully',
        severity: 'success'
      });
    } catch (err) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to update delivery zone',
        severity: 'error'
      });
    }
  };

  const handleDeleteZone = async () => {
    try {
      if (!selectedZone) return;

      // Simulate API call
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter out the deleted zone
      const updatedZones = deliveryZones.filter(zone => zone.id !== selectedZone.id);
      setDeliveryZones(updatedZones);
      setLoading(false);
      
      // Close dialog and show success notification
      handleCloseDialogs();
      setSnackbar({
        open: true,
        message: 'Delivery zone deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to delete delivery zone',
        severity: 'error'
      });
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Delivery Zone Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New Zone
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter and Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search zones"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by name or zip code"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Store</InputLabel>
              <Select
                value={storeFilter}
                label="Filter by Store"
                onChange={(e) => setStoreFilter(e.target.value)}
              >
                <MenuItem value="all">All Stores</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setSearchTerm('');
                setStoreFilter('all');
                setStatusFilter('all');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content/Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="delivery zones table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>Radius (km)</TableCell>
                <TableCell>Min Order ($)</TableCell>
                <TableCell>Fee ($)</TableCell>
                <TableCell>Zip Codes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                    <Typography variant="body2">Loading zones...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredDeliveryZones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2">No delivery zones found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveryZones
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((zone) => {
                    const store = stores.find(s => s.id === zone.storeId);
                    return (
                      <TableRow hover key={zone.id}>
                        <TableCell>{zone.name}</TableCell>
                        <TableCell>{store?.name || 'Unknown Store'}</TableCell>
                        <TableCell>{zone.radius}</TableCell>
                        <TableCell>${zone.minOrderValue.toFixed(2)}</TableCell>
                        <TableCell>${zone.deliveryFee.toFixed(2)}</TableCell>
                        <TableCell>
                          {zone.zipCodes.length > 2 
                            ? `${zone.zipCodes.slice(0, 2).join(', ')}... +${zone.zipCodes.length - 2} more`
                            : zone.zipCodes.join(', ')}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor: zone.status === 'active' ? 'success.light' : 'error.light',
                              color: 'white',
                            }}
                          >
                            {zone.status === 'active' ? 'Active' : 'Inactive'}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenEditDialog(zone)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleOpenDeleteDialog(zone)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDeliveryZones.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add Zone Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Delivery Zone
          <IconButton
            onClick={handleCloseDialogs}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zone Name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Store</InputLabel>
                <Select
                  name="storeId"
                  value={formData.storeId || ''}
                  label="Store"
                  onChange={handleFormChange}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Radius (km)"
                name="radius"
                type="number"
                value={formData.radius || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Value ($)"
                name="minOrderValue"
                type="number"
                value={formData.minOrderValue || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delivery Fee ($)"
                name="deliveryFee"
                type="number"
                value={formData.deliveryFee || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Delivery Time"
                name="estimatedDeliveryTime"
                value={formData.estimatedDeliveryTime || ''}
                onChange={handleFormChange}
                placeholder="e.g. 15-30 min"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zip Codes (comma separated)"
                name="zipCodes"
                value={formData.zipCodes?.join(', ') || ''}
                onChange={handleZipCodesChange}
                placeholder="e.g. 10001, 10002, 10003"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                }
                label={formData.status === 'active' ? 'Active' : 'Inactive'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleAddZone} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Zone'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Zone Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Delivery Zone
          <IconButton
            onClick={handleCloseDialogs}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zone Name"
                name="name"
                value={formData.name || ''}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Store</InputLabel>
                <Select
                  name="storeId"
                  value={formData.storeId || ''}
                  label="Store"
                  onChange={handleFormChange}
                >
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Radius (km)"
                name="radius"
                type="number"
                value={formData.radius || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Value ($)"
                name="minOrderValue"
                type="number"
                value={formData.minOrderValue || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Delivery Fee ($)"
                name="deliveryFee"
                type="number"
                value={formData.deliveryFee || ''}
                onChange={handleFormChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Delivery Time"
                name="estimatedDeliveryTime"
                value={formData.estimatedDeliveryTime || ''}
                onChange={handleFormChange}
                placeholder="e.g. 15-30 min"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Zip Codes (comma separated)"
                name="zipCodes"
                value={formData.zipCodes?.join(', ') || ''}
                onChange={handleZipCodesChange}
                placeholder="e.g. 10001, 10002, 10003"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                    color="primary"
                  />
                }
                label={formData.status === 'active' ? 'Active' : 'Inactive'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleEditZone} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the delivery zone "{selectedZone?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button 
            onClick={handleDeleteZone} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DeliveryZoneManagement;