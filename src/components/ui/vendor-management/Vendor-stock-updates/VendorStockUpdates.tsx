import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { mockVendorStockUpdates } from './mockData';
import { VendorStockUpdate, StockUpdateStatus } from './types';
import './VendorStockUpdates.css';

const VendorStockUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<VendorStockUpdate[]>(mockVendorStockUpdates);
  const [selectedUpdate, setSelectedUpdate] = useState<VendorStockUpdate | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const handleViewDetails = (update: VendorStockUpdate) => {
    setSelectedUpdate(update);
    setOpenDialog(true);
  };

  const handleAction = (type: 'approve' | 'reject') => {
    setAction(type);
    if (type === 'approve') {
      setNotes('');
    }
  };

  const handleSubmitAction = () => {
    if (!selectedUpdate) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const updatedUpdates = updates.map(update => 
          update.id === selectedUpdate.id 
            ? { ...update, status: action === 'approve' ? 'approved' : 'rejected', notes }
            : update
        );
        
        setUpdates(updatedUpdates);
        setSnackbarMessage(
          action === 'approve' 
            ? 'Stock update approved successfully!' 
            : 'Stock update rejected successfully!'
        );
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setOpenDialog(false);
      } catch (error) {
        setSnackbarMessage('An error occurred. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUpdate(null);
    setNotes('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const getStatusChip = (status: StockUpdateStatus) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const refreshData = () => {
    // In a real app, this would fetch fresh data from the API
    setUpdates([...mockVendorStockUpdates]);
    setSnackbarMessage('Data refreshed successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  return (
    <Box className="vendor-stock-updates-container">
      <Box className="header-section">
        <Typography variant="h4" component="h1" gutterBottom>
          Review Vendor Stock Updates
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell>Items Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No stock updates to review
                </TableCell>
              </TableRow>
            ) : (
              updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell>
                    <Typography>{update.vendorName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {update.vendorEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>{update.storeName}</TableCell>
                  <TableCell>
                    {new Date(update.submittedAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{update.items.length}</TableCell>
                  <TableCell>{getStatusChip(update.status)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(update)}
                      disabled={update.status !== 'pending'}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Stock Update Details - {selectedUpdate?.storeName}
          <Typography variant="subtitle1" color="text.secondary">
            Vendor: {selectedUpdate?.vendorName}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUpdate && (
            <Box>
              <Box mb={3}>
                <Typography variant="body1" gutterBottom>
                  <strong>Submitted:</strong> {new Date(selectedUpdate.submittedAt).toLocaleString()}
                </Typography>
                {selectedUpdate.notes && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Vendor Notes:</strong> {selectedUpdate.notes}
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Items to Update
              </Typography>
              
              {selectedUpdate.items.map((item) => (
                <Accordion key={item.id} defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      {item.productName}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      {item.category}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Property</TableCell>
                          <TableCell>Current</TableCell>
                          <TableCell>Updated</TableCell>
                          <TableCell>Difference</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Stock</TableCell>
                          <TableCell>{item.currentStock}</TableCell>
                          <TableCell>{item.updatedStock}</TableCell>
                          <TableCell>
                            {item.updatedStock - item.currentStock > 0 ? '+' : ''}
                            {item.updatedStock - item.currentStock}
                          </TableCell>
                        </TableRow>
                        {item.updatedPrice && (
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>${item.updatedPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              {item.updatedPrice - item.price > 0 ? '+' : ''}
                              ${(item.updatedPrice - item.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <Box mt={1}>
                      <Typography variant="body2">
                        <strong>Reason:</strong> {item.reason}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Box mt={3}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={action}
                    onChange={(e) => handleAction(e.target.value as 'approve' | 'reject')}
                    label="Action"
                  >
                    <MenuItem value="approve">Approve</MenuItem>
                    <MenuItem value="reject">Reject</MenuItem>
                  </Select>
                </FormControl>

                {action === 'reject' && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Rejection Notes"
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    helperText="Please provide a reason for rejection"
                  />
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAction}
            color={action === 'approve' ? 'success' : 'error'}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : action === 'approve' ? <CheckIcon /> : <CloseIcon />}
          >
            {loading ? 'Processing...' : action === 'approve' ? 'Approve Update' : 'Reject Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorStockUpdates;