import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Button, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Define TypeScript interfaces
interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'paid' | 'unpaid';
}

// Dummy data
const generateDummyOrders = (): Order[] => {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'];
  const paymentStatuses: Order['paymentStatus'][] = ['paid', 'unpaid'];
  
  return Array.from({ length: 50 }, (_, index) => {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 60));
    
    const items: OrderItem[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, itemIndex) => ({
      productId: `prod-${Math.floor(Math.random() * 10000)}`,
      productName: `Product ${Math.floor(Math.random() * 100)}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
    }));
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      id: `order-${index + 1}`,
      userId: `user-${Math.floor(Math.random() * 1000)}`,
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerName: `Customer ${index + 1}`,
      orderDate: orderDate.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total,
      items,
      shippingAddress: {
        street: `${Math.floor(Math.random() * 1000) + 1} Main Street`,
        city: `City ${Math.floor(Math.random() * 100)}`,
        state: `State ${Math.floor(Math.random() * 50)}`,
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'United States',
      },
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
    };
  });
};

// Status chip color mapping
const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'processing': return 'info';
    case 'shipped': return 'primary';
    case 'delivered': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const UserOrders: React.FC = () => {
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<{ from: string, to: string }>({ from: '', to: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Stats for summary cards
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Fetch orders (simulated with dummy data)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const dummyOrders = generateDummyOrders();
        setOrders(dummyOrders);
        setFilteredOrders(dummyOrders);
        
        // Calculate stats
        const newStats = {
          total: dummyOrders.length,
          pending: dummyOrders.filter(o => o.status === 'pending').length,
          processing: dummyOrders.filter(o => o.status === 'processing').length,
          shipped: dummyOrders.filter(o => o.status === 'shipped').length,
          delivered: dummyOrders.filter(o => o.status === 'delivered').length,
          cancelled: dummyOrders.filter(o => o.status === 'cancelled').length
        };
        setStats(newStats);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch orders. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters when search term or filters change
  useEffect(() => {
    // Filter function
    const applyFilters = () => {
      let result = [...orders];
      
      // Apply search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(order => 
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term)
        );
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        result = result.filter(order => order.status === statusFilter);
      }
      
      // Apply date filter
      if (dateFilter.from) {
        const fromDate = new Date(dateFilter.from);
        result = result.filter(order => new Date(order.orderDate) >= fromDate);
      }
      
      if (dateFilter.to) {
        const toDate = new Date(dateFilter.to);
        toDate.setHours(23, 59, 59, 999); // End of day
        result = result.filter(order => new Date(order.orderDate) <= toDate);
      }
      
      setFilteredOrders(result);
      // Reset pagination when filters change
      setPage(0);
    };
    
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Get selected order details
  const getSelectedOrder = (): Order | undefined => {
    return selectedOrderId ? orders.find(order => order.id === selectedOrderId) : undefined;
  };

  // Handler functions
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const dummyOrders = generateDummyOrders();
    setOrders(dummyOrders);
    setSnackbar({
      open: true,
      message: 'Orders refreshed successfully',
      severity: 'success'
    });
    setLoading(false);
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrderId(null);
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setDateFilter({ from: '', to: '' });
    setSearchTerm('');
    setFilterDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render order details dialog
  const renderOrderDetailsDialog = () => {
    const selectedOrder = getSelectedOrder();
    
    if (!selectedOrder) return null;
    
    return (
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - {selectedOrder.orderNumber}
          <IconButton
            aria-label="close"
            onClick={handleCloseOrderDetails}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">Order Information</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Customer:</strong> {selectedOrder.customerName}</Typography>
                <Typography><strong>Order Date:</strong> {format(new Date(selectedOrder.orderDate), 'PPP')}</Typography>
                <Typography><strong>Status:</strong> 
                  <Chip 
                    size="small" 
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)} 
                    color={getStatusColor(selectedOrder.status) as any}
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</Typography>
                <Typography><strong>Payment Status:</strong> 
                  <Chip 
                    size="small" 
                    label={selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} 
                    color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'error'}
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">Shipping Address</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography>{selectedOrder.shippingAddress.street}</Typography>
                <Typography>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</Typography>
                <Typography>{selectedOrder.shippingAddress.country}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Order Items</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right"><strong>Order Total:</strong></TableCell>
                      <TableCell align="right"><strong>${selectedOrder.total.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOrderDetails}>Close</Button>
          {/* Additional action buttons can be added here as needed */}
        </DialogActions>
      </Dialog>
    );
  };

  // Render filter dialog
  const renderFilterDialog = () => {
    return (
      <Dialog open={filterDialogOpen} onClose={handleCloseFilterDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Filter Orders</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Order Status</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <Chip
                  key={status}
                  label={status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  onClick={() => setStatusFilter(status as any)}
                  color={statusFilter === status ? 'primary' : 'default'}
                  variant={statusFilter === status ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Order Date Range</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="From"
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="To"
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button onClick={handleApplyFilters} variant="contained" color="primary">Apply</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render order statistics
  const renderOrderStats = () => {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Total</Typography>
              <Typography variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Pending</Typography>
              <Typography variant="h5" color="warning.main">{stats.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Processing</Typography>
              <Typography variant="h5" color="info.main">{stats.processing}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Shipped</Typography>
              <Typography variant="h5" color="primary.main">{stats.shipped}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Delivered</Typography>
              <Typography variant="h5" color="success.main">{stats.delivered}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography color="textSecondary" variant="subtitle2">Cancelled</Typography>
              <Typography variant="h5" color="error.main">{stats.cancelled}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Orders
      </Typography>

      {/* Order statistics */}
      {renderOrderStats()}

      {/* Search and filters */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2 }}>
        <TextField
          placeholder="Search by order # or customer"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button 
          variant="outlined" 
          startIcon={<FilterListIcon />}
          onClick={handleOpenFilterDialog}
        >
          Filters
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Orders table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>Loading orders...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1">No orders found</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your search or filters
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'PP')}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small"
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                          color={getStatusColor(order.status) as any}
                        />
                      </TableCell>
                      <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewOrderDetails(order.id)}
                          aria-label="View order details"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order details dialog */}
      {renderOrderDetailsDialog()}

      {/* Filter dialog */}
      {renderFilterDialog()}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserOrders;