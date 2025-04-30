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
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import { Search, FilterList, Refresh } from '@mui/icons-material';

// Types
interface StockExchangeRequest {
  id: string;
  requestDate: string;
  storeName: string;
  productName: string;
  currentStock: number;
  requestedStock: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processed';
}

const ProcessStockExchangeRequest: React.FC = () => {
  // State
  const [requests, setRequests] = useState<StockExchangeRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<StockExchangeRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<StockExchangeRequest | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | 'process' | ''>('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  // Dummy data - replace with API call in real implementation
  useEffect(() => {
    const dummyData: StockExchangeRequest[] = [
      {
        id: 'REQ-001',
        requestDate: '2023-05-15',
        storeName: 'Fresh Mart',
        productName: 'Organic Apples',
        currentStock: 50,
        requestedStock: 100,
        reason: 'High demand expected this weekend',
        status: 'Pending'
      },
      {
        id: 'REQ-002',
        requestDate: '2023-05-14',
        storeName: 'Gourmet Delights',
        productName: 'Free Range Eggs',
        currentStock: 30,
        requestedStock: 60,
        reason: 'Regular stock running low',
        status: 'Approved'
      },
      {
        id: 'REQ-003',
        requestDate: '2023-05-13',
        storeName: 'Urban Grocers',
        productName: 'Whole Wheat Bread',
        currentStock: 20,
        requestedStock: 40,
        reason: 'Promotion starting next week',
        status: 'Rejected'
      },
      {
        id: 'REQ-004',
        requestDate: '2023-05-12',
        storeName: 'Fresh Mart',
        productName: 'Organic Bananas',
        currentStock: 45,
        requestedStock: 90,
        reason: 'Seasonal demand increase',
        status: 'Processed'
      },
      {
        id: 'REQ-005',
        requestDate: '2023-05-11',
        storeName: 'City Market',
        productName: 'Almond Milk',
        currentStock: 15,
        requestedStock: 30,
        reason: 'New product line',
        status: 'Pending'
      },
      {
        id: 'REQ-006',
        requestDate: '2023-05-10',
        storeName: 'Gourmet Delights',
        productName: 'Artisan Cheese',
        currentStock: 10,
        requestedStock: 25,
        reason: 'Special event order',
        status: 'Pending'
      },
      {
        id: 'REQ-007',
        requestDate: '2023-05-09',
        storeName: 'Urban Grocers',
        productName: 'Organic Spinach',
        currentStock: 35,
        requestedStock: 70,
        reason: 'Weekly sale',
        status: 'Approved'
      },
      {
        id: 'REQ-008',
        requestDate: '2023-05-08',
        storeName: 'City Market',
        productName: 'Greek Yogurt',
        currentStock: 25,
        requestedStock: 50,
        reason: 'Regular restock',
        status: 'Processed'
      },
      {
        id: 'REQ-009',
        requestDate: '2023-05-07',
        storeName: 'Fresh Mart',
        productName: 'Organic Tomatoes',
        currentStock: 40,
        requestedStock: 80,
        reason: 'New supplier contract',
        status: 'Rejected'
      },
      {
        id: 'REQ-010',
        requestDate: '2023-05-06',
        storeName: 'Gourmet Delights',
        productName: 'Avocados',
        currentStock: 18,
        requestedStock: 36,
        reason: 'Seasonal menu update',
        status: 'Pending'
      }
    ];

    setRequests(dummyData);
    setFilteredRequests(dummyData);
    setLoading(false);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = requests;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(req => 
        req.storeName.toLowerCase().includes(term) || 
        req.productName.toLowerCase().includes(term) ||
        req.id.toLowerCase().includes(term)
      );
    }
    
    setFilteredRequests(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, requests]);

  // Pagination logic
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Action handlers
  const handleOpenDialog = (request: StockExchangeRequest, actionType: 'approve' | 'reject' | 'process') => {
    setSelectedRequest(request);
    setAction(actionType);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setAction('');
  };

  const handleConfirmAction = () => {
    if (!selectedRequest) return;
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const updatedRequests = requests.map(req => {
        if (req.id === selectedRequest.id) {
          let newStatus: StockExchangeRequest['status'] = req.status;
          
          if (action === 'approve') newStatus = 'Approved';
          else if (action === 'reject') newStatus = 'Rejected';
          else if (action === 'process') newStatus = 'Processed';
          
          return { ...req, status: newStatus };
        }
        return req;
      });
      
      setRequests(updatedRequests);
      setLoading(false);
      setOpenDialog(false);
      
      setSnackbar({
        open: true,
        message: `Request ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'processed'} successfully!`,
        severity: 'success'
      });
    }, 1000);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Data refreshed successfully!',
        severity: 'info'
      });
    }, 800);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Processed': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Process Stock Exchange Requests
      </Typography>
      
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search requests..."
            InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Processed">Processed</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
            }}
          >
            Clear Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ ml: 'auto' }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>
      
      {/* Requests Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Requested Stock</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRequests.length > 0 ? (
                  paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>{request.storeName}</TableCell>
                      <TableCell>{request.productName}</TableCell>
                      <TableCell>{request.currentStock}</TableCell>
                      <TableCell>{request.requestedStock}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>{request.reason}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        {request.status === 'Pending' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              sx={{ mr: 1, mb: 1 }}
                              onClick={() => handleOpenDialog(request, 'approve')}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleOpenDialog(request, 'reject')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {request.status === 'Approved' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDialog(request, 'process')}
                          >
                            Mark as Processed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          {filteredRequests.length > rowsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredRequests.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {action === 'approve' && 'Approve Request'}
          {action === 'reject' && 'Reject Request'}
          {action === 'process' && 'Process Request'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography gutterBottom>
                You are about to {action} the following stock exchange request:
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Request ID:</strong> {selectedRequest.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Store:</strong> {selectedRequest.storeName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Product:</strong> {selectedRequest.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Requested Stock:</strong> {selectedRequest.requestedStock} (Current: {selectedRequest.currentStock})
              </Typography>
              
              {action === 'reject' && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Rejection Reason"
                  placeholder="Enter reason for rejection (optional)"
                  sx={{ mt: 2 }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={action === 'reject' ? 'error' : 'primary'}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProcessStockExchangeRequest;