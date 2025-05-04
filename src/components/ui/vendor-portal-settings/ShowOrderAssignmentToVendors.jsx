import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
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
  SelectChangeEvent,
} from '@mui/material';
import { Search, FilterList, Refresh } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../../../layout/AppSidebar'; // Adjust import path as needed

// Define types for our data
interface OrderAssignment {
  id: string;
  orderId: string;
  customerName: string;
  vendorName: string;
  vendorId: string;
  assignedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  itemsCount: number;
  totalAmount: number;
  deliveryAddress: string;
}

const ShowOrderAssignmentToVendors: React.FC = () => {
  const theme = useTheme();
  
  // Dummy data for order assignments
  const dummyData: OrderAssignment[] = [
    {
      id: '1',
      orderId: 'ORD-1001',
      customerName: 'John Doe',
      vendorName: 'Fresh Grocery',
      vendorId: 'VEND-001',
      assignedDate: '2023-05-15T10:30:00',
      status: 'Accepted',
      itemsCount: 8,
      totalAmount: 125.75,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY',
    },
    {
      id: '2',
      orderId: 'ORD-1002',
      customerName: 'Jane Smith',
      vendorName: 'Quick Mart',
      vendorId: 'VEND-002',
      assignedDate: '2023-05-15T11:15:00',
      status: 'Pending',
      itemsCount: 5,
      totalAmount: 89.50,
      deliveryAddress: '456 Oak Ave, Brooklyn, NY',
    },
    {
      id: '3',
      orderId: 'ORD-1003',
      customerName: 'Robert Johnson',
      vendorName: 'Urban Fresh',
      vendorId: 'VEND-003',
      assignedDate: '2023-05-14T09:45:00',
      status: 'Completed',
      itemsCount: 12,
      totalAmount: 210.25,
      deliveryAddress: '789 Pine St, Queens, NY',
    },
    {
      id: '4',
      orderId: 'ORD-1004',
      customerName: 'Emily Davis',
      vendorName: 'Fresh Grocery',
      vendorId: 'VEND-001',
      assignedDate: '2023-05-14T14:20:00',
      status: 'Rejected',
      itemsCount: 7,
      totalAmount: 95.30,
      deliveryAddress: '321 Elm St, Bronx, NY',
    },
    {
      id: '5',
      orderId: 'ORD-1005',
      customerName: 'Michael Brown',
      vendorName: 'Quick Mart',
      vendorId: 'VEND-002',
      assignedDate: '2023-05-13T16:50:00',
      status: 'Completed',
      itemsCount: 3,
      totalAmount: 45.90,
      deliveryAddress: '654 Maple Ave, Staten Island, NY',
    },
    {
      id: '6',
      orderId: 'ORD-1006',
      customerName: 'Sarah Wilson',
      vendorName: 'Urban Fresh',
      vendorId: 'VEND-003',
      assignedDate: '2023-05-13T12:30:00',
      status: 'Accepted',
      itemsCount: 9,
      totalAmount: 135.60,
      deliveryAddress: '987 Cedar St, Jersey City, NJ',
    },
    {
      id: '7',
      orderId: 'ORD-1007',
      customerName: 'David Taylor',
      vendorName: 'Fresh Grocery',
      vendorId: 'VEND-001',
      assignedDate: '2023-05-12T18:15:00',
      status: 'Completed',
      itemsCount: 6,
      totalAmount: 78.45,
      deliveryAddress: '159 Birch St, Hoboken, NJ',
    },
    {
      id: '8',
      orderId: 'ORD-1008',
      customerName: 'Lisa Anderson',
      vendorName: 'Quick Mart',
      vendorId: 'VEND-002',
      assignedDate: '2023-05-12T13:40:00',
      status: 'Pending',
      itemsCount: 4,
      totalAmount: 62.80,
      deliveryAddress: '753 Walnut St, Weehawken, NJ',
    },
  ];

  // State management
  const [orderAssignments, setOrderAssignments] = useState<OrderAssignment[]>(dummyData);
  const [filteredData, setFilteredData] = useState<OrderAssignment[]>(dummyData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Get unique vendors for filter dropdown
  const vendors = [...new Set(dummyData.map(item => item.vendorName))];

  // Filter function
  const applyFilters = () => {
    let result = orderAssignments;
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(item =>
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply vendor filter
    if (vendorFilter !== 'all') {
      result = result.filter(item => item.vendorName === vendorFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      result = result.filter(item => item.assignedDate.startsWith(dateFilter));
    }
    
    setFilteredData(result);
    setPage(0); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setVendorFilter('all');
    setDateFilter('');
    setFilteredData(orderAssignments);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, vendorFilter, dateFilter, orderAssignments]);

  // Get status chip color
  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Accepted':
        return 'primary';
      case 'Rejected':
        return 'error';
      case 'Completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Order Assignment to Vendors
          </Typography>
          
          {/* Filters Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value as string)}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Accepted">Accepted</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      value={vendorFilter}
                      label="Vendor"
                      onChange={(e: SelectChangeEvent) => setVendorFilter(e.target.value as string)}
                    >
                      <MenuItem value="all">All Vendors</MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Assigned Date"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={applyFilters}
                    sx={{ mr: 1 }}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Assignments
                  </Typography>
                  <Typography variant="h5">
                    {orderAssignments.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h5">
                    {orderAssignments.filter(o => o.status === 'Pending').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Accepted
                  </Typography>
                  <Typography variant="h5">
                    {orderAssignments.filter(o => o.status === 'Accepted').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h5">
                    {orderAssignments.filter(o => o.status === 'Completed').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Orders Table */}
          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Assigned Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.orderId}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.vendorName}</TableCell>
                          <TableCell>{formatDate(order.assignedDate)}</TableCell>
                          <TableCell>{order.itemsCount}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusChipColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => console.log('View details', order.id)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    {filteredData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No orders found matching your filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ShowOrderAssignmentToVendors;