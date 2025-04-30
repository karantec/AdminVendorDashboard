import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Switch, 
  TextField, 
  FormControlLabel, 
  Divider, 
  Tabs, 
  Tab, 
  Alert, 
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Types for our payment gateways
interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  isDefault: boolean;
  credentials: {
    [key: string]: string;
  };
  testMode: boolean;
  processingFee: string;
  supportedCountries: string[];
  lastTested?: {
    date: string;
    success: boolean;
    message?: string;
  };
}

// Types for form state
interface PaymentGatewayForm {
  id: string;
  enabled: boolean;
  isDefault: boolean;
  testMode: boolean;
  credentials: {
    [key: string]: string;
  };
  processingFee: string;
}

// Dummy data for payment gateways
const dummyPaymentGateways: PaymentGateway[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: '/assets/stripe-logo.svg',
    enabled: true,
    isDefault: true,
    credentials: {
      publishableKey: 'pk_test_123456789',
      secretKey: 'sk_test_987654321',
      webhookSecret: 'whsec_123456789'
    },
    testMode: true,
    processingFee: '2.9% + $0.30',
    supportedCountries: ['US', 'CA', 'UK', 'AU', 'EU'],
    lastTested: {
      date: '2025-04-29T14:30:00',
      success: true
    }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: '/assets/paypal-logo.svg',
    enabled: false,
    isDefault: false,
    credentials: {
      clientId: '',
      clientSecret: '',
      merchantId: ''
    },
    testMode: true,
    processingFee: '3.49% + $0.49',
    supportedCountries: ['US', 'CA', 'UK', 'AU', 'EU', 'BR', 'MX']
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: '/assets/razorpay-logo.svg',
    enabled: true,
    isDefault: false,
    credentials: {
      keyId: 'rzp_test_123456789',
      keySecret: 'rzs_test_987654321'
    },
    testMode: true,
    processingFee: '2% + ₹3',
    supportedCountries: ['IN'],
    lastTested: {
      date: '2025-04-28T10:15:00',
      success: true
    }
  },
  {
    id: 'square',
    name: 'Square',
    logo: '/assets/square-logo.svg',
    enabled: false,
    isDefault: false,
    credentials: {
      accessToken: '',
      applicationId: '',
      locationId: ''
    },
    testMode: true,
    processingFee: '2.6% + $0.10',
    supportedCountries: ['US', 'CA', 'UK', 'AU', 'JP']
  }
];

// Interface for TabPanel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TabPanel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const PaymentGatewaySetting: React.FC = () => {
  // State for the tab value
  const [tabValue, setTabValue] = useState(0);
  
  // State for all payment gateways
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(dummyPaymentGateways);
  
  // State for the current form
  const [currentForm, setCurrentForm] = useState<PaymentGatewayForm | null>(null);
  
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // State for showing password fields
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});

  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmAction: () => {}
  });

  // Effect to set current form when tab changes
  useEffect(() => {
    if (paymentGateways.length > 0 && tabValue < paymentGateways.length) {
      const gateway = paymentGateways[tabValue];
      setCurrentForm({
        id: gateway.id,
        enabled: gateway.enabled,
        isDefault: gateway.isDefault,
        testMode: gateway.testMode,
        credentials: { ...gateway.credentials },
        processingFee: gateway.processingFee
      });
    }
  }, [tabValue, paymentGateways]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle form changes
  const handleFormChange = (field: string, value: string | boolean) => {
    if (!currentForm) return;

    if (field.startsWith('credentials.')) {
      const credentialKey = field.split('.')[1];
      setCurrentForm({
        ...currentForm,
        credentials: {
          ...currentForm.credentials,
          [credentialKey]: value as string
        }
      });
    } else {
      setCurrentForm({
        ...currentForm,
        [field]: value
      });
    }
  };

  // Handle default payment method change
  const handleDefaultChange = (gatewayId: string) => {
    if (currentForm?.id !== gatewayId) return;

    // Only allow setting default if the gateway is enabled
    if (!currentForm.enabled) {
      setSnackbar({
        open: true,
        message: 'You must enable this payment gateway before setting it as default',
        severity: 'warning'
      });
      return;
    }

    // Update all gateways to ensure only one is default
    const updatedGateways = paymentGateways.map(gateway => ({
      ...gateway,
      isDefault: gateway.id === gatewayId
    }));

    setPaymentGateways(updatedGateways);
    setCurrentForm({
      ...currentForm,
      isDefault: true
    });

    setSnackbar({
      open: true,
      message: `${paymentGateways.find(g => g.id === gatewayId)?.name} set as default payment method`,
      severity: 'success'
    });
  };

  // Save changes to a payment gateway
  const saveChanges = async () => {
    if (!currentForm) return;

    setIsLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // If changing from default to non-default, ensure another gateway is set as default
      if (
        paymentGateways[tabValue].isDefault && 
        !currentForm.isDefault && 
        !paymentGateways.some(g => g.id !== currentForm.id && g.enabled)
      ) {
        setSnackbar({
          open: true,
          message: 'You must have at least one enabled default payment gateway',
          severity: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Update the payment gateways state
      const updatedGateways = paymentGateways.map(gateway => {
        if (gateway.id === currentForm.id) {
          return {
            ...gateway,
            enabled: currentForm.enabled,
            isDefault: currentForm.isDefault,
            testMode: currentForm.testMode,
            credentials: { ...currentForm.credentials },
            processingFee: currentForm.processingFee
          };
        }
        // If this gateway is being set as default, make sure others are not default
        if (currentForm.isDefault && gateway.id !== currentForm.id) {
          return {
            ...gateway,
            isDefault: false
          };
        }
        return gateway;
      });

      setPaymentGateways(updatedGateways);
      setSnackbar({
        open: true,
        message: 'Payment gateway settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save payment gateway settings',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection to payment gateway
  const testConnection = async (gatewayId: string) => {
    if (!currentForm) return;

    // Check if credentials are filled
    const credentials = currentForm.credentials;
    const hasEmptyCredentials = Object.values(credentials).some(value => !value);

    if (hasEmptyCredentials) {
      setSnackbar({
        open: true,
        message: 'Please fill all credential fields before testing',
        severity: 'warning'
      });
      return;
    }

    setIsTesting(true);

    try {
      // Simulate API call with timeout and random success/failure
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.3; // 70% chance of success for demo purposes

      // Update the payment gateways state
      const updatedGateways = paymentGateways.map(gateway => {
        if (gateway.id === gatewayId) {
          return {
            ...gateway,
            lastTested: {
              date: new Date().toISOString(),
              success,
              message: success 
                ? 'Connection successful' 
                : 'Invalid API credentials. Please check and try again.'
            }
          };
        }
        return gateway;
      });

      setPaymentGateways(updatedGateways);
      setSnackbar({
        open: true,
        message: success 
          ? 'Connection test successful' 
          : 'Connection test failed. Please check your credentials.',
        severity: success ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to test connection',
        severity: 'error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Toggle password visibility
  const toggleSecretVisibility = (field: string) => {
    setShowSecrets({
      ...showSecrets,
      [field]: !showSecrets[field]
    });
  };

  // Handle disabling a payment gateway
  const handleDisableGateway = (gatewayId: string) => {
    const gateway = paymentGateways.find(g => g.id === gatewayId);
    
    // If this is the default gateway, show confirmation dialog
    if (gateway?.isDefault) {
      setConfirmDialog({
        open: true,
        title: 'Disable Default Payment Gateway',
        message: 'This is currently set as your default payment gateway. Disabling it will affect checkout functionality. Are you sure you want to continue?',
        confirmAction: () => {
          handleFormChange('enabled', false);
          handleFormChange('isDefault', false);
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      });
    } else {
      handleFormChange('enabled', false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Close confirm dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Get the current gateway
  const currentGateway = paymentGateways[tabValue];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Gateway Settings
      </Typography>
      
      <Typography variant="body1" paragraph>
        Configure payment gateways to process transactions on your platform. Enable test mode for development.
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="payment gateway tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {paymentGateways.map((gateway, index) => (
              <Tab 
                key={gateway.id} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{gateway.name}</Typography>
                    {gateway.enabled && (
                      <Tooltip title={gateway.isDefault ? "Default payment method" : "Enabled"}>
                        <CheckCircleOutlineIcon 
                          fontSize="small" 
                          color={gateway.isDefault ? "primary" : "action"} 
                        />
                      </Tooltip>
                    )}
                  </Box>
                } 
                id={`payment-tab-${index}`} 
                aria-controls={`payment-tabpanel-${index}`} 
              />
            ))}
          </Tabs>
        </Box>

        {currentForm && currentGateway && (
          <TabPanel value={tabValue} index={tabValue}>
            <Grid container spacing={3}>
              {/* Gateway Status Section */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PaymentIcon fontSize="large" />
                        <Typography variant="h6">
                          {currentGateway.name} Status
                        </Typography>
                      </Box>
                      
                      <Box>
                        <FormControlLabel 
                          control={
                            <Switch 
                              checked={currentForm.enabled} 
                              onChange={(e) => currentForm.enabled ? 
                                handleDisableGateway(currentForm.id) : 
                                handleFormChange('enabled', e.target.checked)
                              } 
                              color="primary" 
                            />
                          } 
                          label={currentForm.enabled ? "Enabled" : "Disabled"} 
                        />
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Processing Fee: 
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {currentGateway.processingFee}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Supported Countries: 
                          </Typography>
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {currentGateway.supportedCountries.join(', ')}
                          </Typography>
                        </Box>
                        
                        {currentGateway.lastTested && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Last Tested: 
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {new Date(currentGateway.lastTested.date).toLocaleString()}
                              {' '}
                              {currentGateway.lastTested.success ? 
                                <CheckCircleOutlineIcon fontSize="small" color="success" /> : 
                                <ErrorOutlineIcon fontSize="small" color="error" />
                              }
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                          <FormControlLabel 
                            control={
                              <Switch 
                                checked={currentForm.testMode} 
                                onChange={(e) => handleFormChange('testMode', e.target.checked)} 
                                color="primary" 
                              />
                            } 
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>Test Mode</Typography>
                                <Tooltip title="In test mode, no real transactions will be processed">
                                  <HelpOutlineIcon fontSize="small" sx={{ ml: 1 }} />
                                </Tooltip>
                              </Box>
                            } 
                          />
                          
                          <FormControlLabel 
                            control={
                              <Switch 
                                checked={currentForm.isDefault} 
                                onChange={() => handleDefaultChange(currentForm.id)} 
                                color="primary"
                                disabled={!currentForm.enabled}
                              />
                            } 
                            label="Default Payment Method" 
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Credentials Section */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LockIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        API Credentials
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      {Object.keys(currentForm.credentials).map((key) => {
                        const isSecret = key.toLowerCase().includes('secret') || 
                                       key.toLowerCase().includes('key') || 
                                       key.toLowerCase().includes('token') || 
                                       key.toLowerCase().includes('password');
                        
                        return (
                          <Grid item xs={12} md={6} key={key}>
                            <TextField
                              label={key.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                              variant="outlined"
                              fullWidth
                              value={currentForm.credentials[key]}
                              onChange={(e) => handleFormChange(`credentials.${key}`, e.target.value)}
                              type={isSecret && !showSecrets[key] ? 'password' : 'text'}
                              InputProps={{
                                endAdornment: isSecret && (
                                  <IconButton 
                                    onClick={() => toggleSecretVisibility(key)} 
                                    edge="end"
                                  >
                                    {showSecrets[key] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                )
                              }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<RefreshIcon />}
                    onClick={() => testConnection(currentForm.id)}
                    disabled={isTesting || !currentForm.enabled}
                  >
                    {isTesting ? <CircularProgress size={24} /> : 'Test Connection'}
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={saveChanges}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        )}
      </Paper>
      
      {/* Alert for no payment gateways */}
      {paymentGateways.length === 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No payment gateways are configured. Please add at least one payment gateway.
        </Alert>
      )}
      
      {/* Alert for disabled default gateway */}
      {!paymentGateways.some(g => g.enabled && g.isDefault) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Warning: No default payment gateway is enabled. Customers will not be able to complete checkout.
        </Alert>
      )}
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => confirmDialog.confirmAction()} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentGatewaySetting;