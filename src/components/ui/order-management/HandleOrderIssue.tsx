
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterIcon, 
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  WarningAmber as WarningIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Types
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderIssue {
  id: string;
  orderId: string;
  timestamp: string;
  customer: Customer;
  store: Store;
  items: OrderItem[];
  total: number;
  status: 'new' | 'processing' | 'resolved' | 'cancelled';
  issueType: 'missing_items' | 'damaged_items' | 'wrong_items' | 'delayed_delivery' | 'refund_request' | 'other';
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  resolution?: string;
  notes?: string[];
}

interface Note {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

// Dummy data
const DUMMY_ISSUES: OrderIssue[] = [
  {
    id: 'ISS-001',
    orderId: 'ORD-12345',
    timestamp: '2025-04-28T10:30:00Z',
    customer: {
      id: 'CUST-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-123-4567',
      address: '123 Main St, Anytown, USA'
    },
    store: {
      id: 'STR-001',
      name: 'Fresh Market',
      address: '456 Market Ave, Anytown, USA',
      phone: '+1-555-987-6543'
    },
    items: [
      { id: 'ITM-001', name: 'Organic Bananas', quantity: 2, price: 3.99, image: '/images/bananas.jpg' },
      { id: 'ITM-002', name: 'Whole Milk', quantity: 1, price: 4.50, image: '/images/milk.jpg' },
      { id: 'ITM-003', name: 'Whole Wheat Bread', quantity: 1, price: 3.25, image: '/images/bread.jpg' }
    ],
    total: 11.74,
    status: 'new',
    issueType: 'missing_items',
    description: 'The milk was missing from my order.',
    priority: 'high'
  },
  {
    id: 'ISS-002',
    orderId: 'ORD-23456',
    timestamp: '2025-04-27T15:45:00Z',
    customer: {
      id: 'CUST-002',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1-555-765-4321',
      address: '789 Oak Rd, Anytown, USA'
    },
    store: {
      id: 'STR-002',
      name: 'Corner Grocery',
      address: '101 Corner St, Anytown, USA',
      phone: '+1-555-123-9876'
    },
    items: [
      { id: 'ITM-004', name: 'Apples', quantity: 6, price: 5.99, image: '/images/apples.jpg' },
      { id: 'ITM-005', name: 'Orange Juice', quantity: 1, price: 3.99, image: '/images/juice.jpg' }
    ],
    total: 9.98,
    status: 'processing',
    issueType: 'damaged_items',
    description: 'Three of the apples were bruised.',
    priority: 'medium',
    assignedTo: 'Support Agent 1',
    notes: ['Contacted customer to get more details', 'Offered replacement or refund']
  },
  {
    id: 'ISS-003',
    orderId: 'ORD-34567',
    timestamp: '2025-04-26T09:15:00Z',
    customer: {
      id: 'CUST-003',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1-555-888-9999',
      address: '555 Pine Lane, Anytown, USA'
    },
    store: {
      id: 'STR-001',
      name: 'Fresh Market',
      address: '456 Market Ave, Anytown, USA',
      phone: '+1-555-987-6543'
    },
    items: [
      { id: 'ITM-006', name: 'Chicken Breast', quantity: 2, price: 12.99, image: '/images/chicken.jpg' },
      { id: 'ITM-007', name: 'Broccoli', quantity: 1, price: 2.50, image: '/images/broccoli.jpg' },
      { id: 'ITM-008', name: 'Brown Rice', quantity: 1, price: 4.99, image: '/images/rice.jpg' }
    ],
    total: 20.48,
    status: 'resolved',
    issueType: 'delayed_delivery',
    description: 'My order was delivered 2 hours late.',
    priority: 'low',
    assignedTo: 'Support Agent 2',
    resolution: 'Issued a $5 credit to customer account as compensation.',
    notes: ['Delivery was delayed due to traffic accident', 'Customer was understanding', 'Issued $5 credit as goodwill']
  },
  {
    id: 'ISS-004',
    orderId: 'ORD-45678',
    timestamp: '2025-04-29T08:10:00Z',
    customer: {
      id: 'CUST-004',
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      phone: '+1-555-222-3333',
      address: '888 Maple Dr, Anytown, USA'
    },
    store: {
      id: 'STR-003',
      name: 'Super Saver',
      address: '222 Discount Blvd, Anytown, USA',
      phone: '+1-555-444-5555'
    },
    items: [
      { id: 'ITM-009', name: 'Tomatoes', quantity: 4, price: 3.99, image: '/images/tomatoes.jpg' },
      { id: 'ITM-010', name: 'Ground Beef', quantity: 1, price: 9.99, image: '/images/beef.jpg' },
      { id: 'ITM-011', name: 'Pasta', quantity: 2, price: 1.50, image: '/images/pasta.jpg' }
    ],
    total: 16.98,
    status: 'new',
    issueType: 'wrong_items',
    description: 'I received spaghetti instead of penne pasta.',
    priority: 'medium'
  },
  {
    id: 'ISS-005',
    orderId: 'ORD-56789',
    timestamp: '2025-04-28T14:20:00Z',
    customer: {
      id: 'CUST-005',
      name: 'David Wilson',
      email: 'david.w@example.com',
      phone: '+1-555-777-8888',
      address: '444 Elm Court, Anytown, USA'
    },
    store: {
      id: 'STR-002',
      name: 'Corner Grocery',
      address: '101 Corner St, Anytown, USA',
      phone: '+1-555-123-9876'
    },
    items: [
      { id: 'ITM-012', name: 'Eggs', quantity: 1, price: 5.49, image: '/images/eggs.jpg' },
      { id: 'ITM-013', name: 'Butter', quantity: 1, price: 4.99, image: '/images/butter.jpg' },
      { id: 'ITM-014', name: 'Sugar', quantity: 1, price: 2.99, image: '/images/sugar.jpg' }
    ],
    total: 13.47,
    status: 'cancelled',
    issueType: 'refund_request',
    description: 'I want to return these items and get a refund.',
    priority: 'high',
    assignedTo: 'Support Agent 3',
    resolution: 'Refund processed for full amount.',
    notes: ['Customer changed their mind', 'Items were not opened', 'Approved full refund']
  }
];

const HandleOrderIssues: React.FC = () => {
  // State
  const [issues, setIssues] = useState<OrderIssue[]>(DUMMY_ISSUES);
  const [filteredIssues, setFilteredIssues] = useState<OrderIssue[]>(DUMMY_ISSUES);
  const [tabValue, setTabValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<OrderIssue | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDetailView, setIsDetailView] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>('');
  const [resolutionText, setResolutionText] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // Effects
  useEffect(() => {
    filterIssues();
  }, [searchQuery, statusFilter, priorityFilter, typeFilter, tabValue, issues]);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as string);
  };

  const handlePriorityFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPriorityFilter(event.target.value as string);
  };

  const handleTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTypeFilter(event.target.value as string);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTypeFilter('all');
  };

  const handleIssueSelect = (issue: OrderIssue) => {
    setSelectedIssue(issue);
    setIsDetailView(true);
    setResolutionText(issue.resolution || '');
  };

  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedIssue(null);
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedIssue) return;

    const updatedIssue = {
      ...selectedIssue,
      notes: [
        ...(selectedIssue.notes || []),
        `${new Date().toLocaleString()}: ${newNote}`,
      ],
    };

    setIssues(issues.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));

    setSelectedIssue(updatedIssue);
    setNewNote('');
  };

  const handleStatusChange = (newStatus: 'new' | 'processing' | 'resolved' | 'cancelled') => {
    if (!selectedIssue) return;

    // If resolving, open dialog for resolution details
    if (newStatus === 'resolved' && selectedIssue.status !== 'resolved') {
      setIsDialogOpen(true);
      return;
    }

    updateIssueStatus(newStatus);
  };

  const handleResolutionSubmit = () => {
    if (!selectedIssue) return;
    
    updateIssueStatus('resolved', resolutionText);
    setIsDialogOpen(false);
  };

  const updateIssueStatus = (newStatus: 'new' | 'processing' | 'resolved' | 'cancelled', resolution?: string) => {
    if (!selectedIssue) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedIssue = {
        ...selectedIssue,
        status: newStatus,
        resolution: newStatus === 'resolved' ? (resolution || selectedIssue.resolution) : selectedIssue.resolution,
        assignedTo: newStatus === 'new' ? undefined : (selectedIssue.assignedTo || 'Current User'),
      };

      setIssues(issues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      ));

      setSelectedIssue(updatedIssue);
      setLoading(false);
    }, 500);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Helper functions
  const filterIssues = () => {
    let result = [...issues];

    // Filter by tab
    if (tabValue === 1) {
      result = result.filter(issue => issue.status === 'new');
    } else if (tabValue === 2) {
      result = result.filter(issue => issue.status === 'processing');
    } else if (tabValue === 3) {
      result = result.filter(issue => issue.status === 'resolved');
    } else if (tabValue === 4) {
      result = result.filter(issue => issue.status === 'cancelled');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        issue =>
          issue.id.toLowerCase().includes(query) ||
          issue.orderId.toLowerCase().includes(query) ||
          issue.customer.name.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(issue => issue.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      result = result.filter(issue => issue.priority === priorityFilter);
    }

    // Filter by issue type
    if (typeFilter !== 'all') {
      result = result.filter(issue => issue.issueType === typeFilter);
    }

    setFilteredIssues(result);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'info';
      case 'processing':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case 'missing_items':
        return 'Missing Items';
      case 'damaged_items':
        return 'Damaged Items';
      case 'wrong_items':
        return 'Wrong Items';
      case 'delayed_delivery':
        return 'Delayed Delivery';
      case 'refund_request':
        return 'Refund Request';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3 }}>
      {isDetailView && selectedIssue ? (
        // Detail View
        <Box>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBackToList} 
            variant="outlined" 
            sx={{ mb: 3 }}
          >
            Back to All Issues
          </Button>

          <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                  Issue {selectedIssue.id} - Order {selectedIssue.orderId}
                </Typography>
                <Chip 
                  label={selectedIssue.status.toUpperCase()} 
                  color={getStatusColor(selectedIssue.status) as any}
                  sx={{ fontWeight: 'bold' }} 
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip 
                  label={`Priority: ${selectedIssue.priority.toUpperCase()}`} 
                  color={getPriorityColor(selectedIssue.priority) as any} 
                  size="small"
                />
                <Chip 
                  label={getIssueTypeLabel(selectedIssue.issueType)} 
                  variant="outlined" 
                  size="small"
                />
                <Chip 
                  label={`Reported: ${new Date(selectedIssue.timestamp).toLocaleDateString()}`} 
                  variant="outlined" 
                  size="small"
                />
              </Box>
            </Grid>

            {/* Left Column - Order & Issue Details */}
            <Grid item xs={12} md={7}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Issue Description
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedIssue.description}
                  </Typography>

                  {selectedIssue.resolution && (
                    <>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Resolution
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedIssue.resolution}
                      </Typography>
                    </>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Order Items
                  </Typography>

                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedIssue.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell component="th" scope="row">
                              {item.name}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="right">{formatCurrency(item.price * item.quantity)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                            Total:
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(selectedIssue.total)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Customer, Store & Actions */}
            <Grid item xs={12} md={5}>
              {/* Customer Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Customer Information
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedIssue.customer.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedIssue.customer.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {selectedIssue.customer.phone}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {selectedIssue.customer.address}
                  </Typography>
                </CardContent>
              </Card>

              {/* Store Info */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StoreIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Store Information
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedIssue.store.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {selectedIssue.store.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {selectedIssue.store.phone}
                  </Typography>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedIssue.status !== 'new' && (
                      <Button 
                        variant="outlined" 
                        startIcon={<WarningIcon />}
                        onClick={() => handleStatusChange('new')}
                        disabled={loading}
                      >
                        Mark as New
                      </Button>
                    )}
                    
                    {selectedIssue.status !== 'processing' && selectedIssue.status !== 'resolved' && (
                      <Button 
                        variant="outlined" 
                        color="warning"
                        startIcon={<WarningIcon />}
                        onClick={() => handleStatusChange('processing')}
                        disabled={loading}
                      >
                        Start Processing
                      </Button>
                    )}
                    
                    {selectedIssue.status !== 'resolved' && (
                      <Button 
                        variant="contained" 
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleStatusChange('resolved')}
                        disabled={loading}
                      >
                        Resolve Issue
                      </Button>
                    )}
                    
                    {selectedIssue.status !== 'cancelled' && (
                      <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={loading}
                      >
                        Cancel Issue
                      </Button>
                    )}
                  </Box>
                  {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Notes & Activity
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Add a note"
                      multiline
                      rows={2}
                      fullWidth
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        variant="contained" 
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                      >
                        Add Note
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {selectedIssue.notes && selectedIssue.notes.length > 0 ? (
                      selectedIssue.notes.map((note, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <Typography variant="body2">{note}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No notes yet.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Resolution Dialog */}
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Resolve Issue {selectedIssue.id}
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please provide details about how this issue was resolved:
              </Typography>
              <TextField
                label="Resolution Details"
                multiline
                rows={4}
                fullWidth
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleResolutionSubmit} 
                variant="contained" 
                color="primary"
                disabled={!resolutionText.trim()}
              >
                Save Resolution
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        // List View
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Handle Order Issues
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="issue tabs">
              <Tab label="All Issues" />
              <Tab label="New" />
              <Tab label="Processing" />
              <Tab label="Resolved" />
              <Tab label="Cancelled" />
            </Tabs>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ minWidth: '250px' }}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: '150px' }}>
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                label="Priority"
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: '180px' }}>
              <InputLabel id="type-filter-label">Issue Type</InputLabel>
              <Select
                labelId="type-filter-label"
                value={typeFilter}
                onChange={handleTypeFilterChange}
                label="Issue Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="missing_items">Missing Items</MenuItem>
                <MenuItem value="damaged_items">Damaged Items</MenuItem>
                <MenuItem value="wrong_items">Wrong Items</MenuItem>
                <MenuItem value="delayed_delivery">Delayed Delivery</MenuItem>
                <MenuItem value="refund_request">Refund Request</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <Button 
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredIssues.length} issues
            </Typography>
          </Box>

          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No issues found matching your filters
                </Typography>
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={handleResetFilters}
                  sx={{ mt: 2 }}
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="order issues table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIssues
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((issue) => (
                    <TableRow key={issue.id} hover>
                      <TableCell>{issue.id}</TableCell>
                      <TableCell>{issue.orderId}</TableCell>
                      <TableCell>{issue.customer.name}</TableCell>
                      <TableCell>{new Date(issue.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getIssueTypeLabel(issue.issueType)} 
                          size="small" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={issue.priority.toUpperCase()} 
                          color={getPriorityColor(issue.priority) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={issue.status.toUpperCase()} 
                          color={getStatusColor(issue.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          size="small"
                          onClick={() => handleIssueSelect(issue)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredIssues.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default HandleOrderIssues;