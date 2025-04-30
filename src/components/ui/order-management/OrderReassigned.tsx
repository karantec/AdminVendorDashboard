import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalShipping, AssignmentInd, Info, CheckCircle, Cancel } from '@mui/icons-material';

// Define types
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  storeName: string;
  originalDriver: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  itemsCount: number;
  totalAmount: number;
  createdAt: string;
}

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  currentOrders: number;
}

// Dummy data
const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    customerName: 'John Doe',
    storeName: 'Fresh Mart',
    originalDriver: 'Driver Smith',
    status: 'pending',
    itemsCount: 8,
    totalAmount: 45.99,
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    customerName: 'Jane Smith',
    storeName: 'Quick Grocery',
    originalDriver: 'Driver Johnson',
    status: 'in-progress',
    itemsCount: 5,
    totalAmount: 32.50,
    createdAt: '2023-05-15T11:15:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-003',
    customerName: 'Robert Brown',
    storeName: 'Urban Fresh',
    originalDriver: 'Driver Williams',
    status: 'pending',
    itemsCount: 12,
    totalAmount: 78.25,
    createdAt: '2023-05-15T12:45:00Z'
  },
];

const dummyDrivers: Driver[] = [
  { id: '1', name: 'Driver Adams', status: 'available', currentOrders: 1 },
  { id: '2', name: 'Driver Baker', status: 'available', currentOrders: 0 },
  { id: '3', name: 'Driver Clark', status: 'busy', currentOrders: 3 },
  { id: '4', name: 'Driver Davis', status: 'available', currentOrders: 2 },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const OrderReassigned: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const ordersResponse = await fetch('/api/orders/reassign');
        // const driversResponse = await fetch('/api/drivers');
        
        // Using dummy data for now
        setTimeout(() => {
          setOrders(dummyOrders);
          setDrivers(dummyDrivers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReassignClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedDriver('');
    setOpenDialog(true);
  };

  const handleDriverChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedDriver(event.target.value as string);
  };

  const handleReassignConfirm = () => {
    if (!selectedOrder || !selectedDriver) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would call your API
      // await fetch(`/api/orders/${selectedOrder.id}/reassign`, {
      //   method: 'POST',
      //   body: JSON.stringify({ driverId: selectedDriver })
      // });
      
      // Update local state
      const updatedOrders = orders.filter(order => order.id !== selectedOrder.id);
      setOrders(updatedOrders);
      
      setSnackbarMessage(`Order ${selectedOrder.orderNumber} reassigned successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setOpenDialog(false);
      setLoading(false);
    }, 800);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip icon={<Info />} label="Pending" color="warning" variant="outlined" />;
      case 'in-progress':
        return <Chip icon={<LocalShipping />} label="In Progress" color="primary" />;
      case 'completed':
        return <Chip icon={<CheckCircle />} label="Completed" color="success" />;
      case 'cancelled':
        return <Chip icon={<Cancel />} label="Cancelled" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  const getDriverStatusChip = (status: string) => {
    switch (status) {
      case 'available':
        return <Chip label="Available" color="success" size="small" />;
      case 'busy':
        return <Chip label="Busy" color="warning" size="small" />;
      case 'offline':
        return <Chip label="Offline" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AssignmentInd sx={{ mr: 1 }} /> Order Reassignment
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Reassign pending or in-progress orders to different drivers when needed.
      </Typography>
      
      {loading && orders.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'common.white' }}>Order #</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Customer</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Store</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Original Driver</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Status</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Items</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Total</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Created At</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <StyledTableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.storeName}</TableCell>
                  <TableCell>{order.originalDriver}</TableCell>
                  <TableCell>{getStatusChip(order.status)}</TableCell>
                  <TableCell>{order.itemsCount}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleReassignClick(order)}
                      disabled={order.status === 'completed' || order.status === 'cancelled'}
                    >
                      Reassign
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {orders.length === 0 && !loading && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No orders available for reassignment.
          </Typography>
        </Box>
      )}
      
      {/* Reassignment Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reassign Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Order #:</strong> {selectedOrder.orderNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Current Driver:</strong> {selectedOrder.originalDriver}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="driver-select-label">Select New Driver</InputLabel>
                <Select
                  labelId="driver-select-label"
                  value={selectedDriver}
                  label="Select New Driver"
                  onChange={handleDriverChange}
                >
                  {drivers
                    .filter(driver => driver.status !== 'offline')
                    .map(driver => (
                      <MenuItem key={driver.id} value={driver.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {driver.name}
                          {getDriverStatusChip(driver.status)}
                          <Typography variant="caption" color="text.secondary">
                            ({driver.currentOrders} orders)
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={handleReassignConfirm}
            color="primary"
            variant="contained"
            disabled={!selectedDriver || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Reassignment'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderReassigned;