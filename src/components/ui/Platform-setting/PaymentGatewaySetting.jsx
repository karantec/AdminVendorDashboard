import React, { useState, useEffect } from "react";
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
  DialogActions,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";

// Icons
import SaveIcon from "@mui/icons-material/Save";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SettingsIcon from "@mui/icons-material/Settings";

// Dummy data for payment gateways
const dummyPaymentGateways = [
  {
    id: "stripe",
    name: "Stripe",
    logo: "/assets/stripe-logo.svg",
    enabled: true,
    isDefault: true,
    credentials: {
      publishableKey: "pk_test_123456789",
      secretKey: "sk_test_987654321",
      webhookSecret: "whsec_123456789",
    },
    testMode: true,
    processingFee: "2.9% + $0.30",
    supportedCountries: ["US", "CA", "UK", "AU", "EU"],
    lastTested: {
      date: "2025-04-29T14:30:00",
      success: true,
    },
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "/assets/paypal-logo.svg",
    enabled: false,
    isDefault: false,
    credentials: {
      clientId: "",
      clientSecret: "",
      merchantId: "",
    },
    testMode: true,
    processingFee: "3.49% + $0.49",
    supportedCountries: ["US", "CA", "UK", "AU", "EU", "BR", "MX"],
  },
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "/assets/razorpay-logo.svg",
    enabled: true,
    isDefault: false,
    credentials: {
      keyId: "rzp_test_123456789",
      keySecret: "rzs_test_987654321",
    },
    testMode: true,
    processingFee: "2% + ₹3",
    supportedCountries: ["IN"],
    lastTested: {
      date: "2025-04-28T10:15:00",
      success: true,
    },
  },
  {
    id: "square",
    name: "Square",
    logo: "/assets/square-logo.svg",
    enabled: false,
    isDefault: false,
    credentials: {
      accessToken: "",
      applicationId: "",
      locationId: "",
    },
    testMode: true,
    processingFee: "2.6% + $0.10",
    supportedCountries: ["US", "CA", "UK", "AU", "JP"],
  },
];

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const PaymentGatewaySetting = () => {
  // Get theme and media query for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // State for the tab value
  const [tabValue, setTabValue] = useState(0);

  // State for all payment gateways
  const [paymentGateways, setPaymentGateways] = useState(dummyPaymentGateways);

  // State for the current form
  const [currentForm, setCurrentForm] = useState(null);

  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // State for snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for showing password fields
  const [showSecrets, setShowSecrets] = useState({});

  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    confirmAction: () => {},
  });
  
  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        processingFee: gateway.processingFee,
      });
    }
  }, [tabValue, paymentGateways]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    if (!currentForm) return;

    if (field.startsWith("credentials.")) {
      const credentialKey = field.split(".")[1];
      setCurrentForm({
        ...currentForm,
        credentials: {
          ...currentForm.credentials,
          [credentialKey]: value,
        },
      });
    } else {
      setCurrentForm({
        ...currentForm,
        [field]: value,
      });
    }
  };

  // Handle default payment method change
  const handleDefaultChange = (gatewayId) => {
    if (currentForm?.id !== gatewayId) return;

    // Only allow setting default if the gateway is enabled
    if (!currentForm.enabled) {
      setSnackbar({
        open: true,
        message:
          "You must enable this payment gateway before setting it as default",
        severity: "warning",
      });
      return;
    }

    // Update all gateways to ensure only one is default
    const updatedGateways = paymentGateways.map((gateway) => ({
      ...gateway,
      isDefault: gateway.id === gatewayId,
    }));

    setPaymentGateways(updatedGateways);
    setCurrentForm({
      ...currentForm,
      isDefault: true,
    });

    setSnackbar({
      open: true,
      message: `${
        paymentGateways.find((g) => g.id === gatewayId)?.name
      } set as default payment method`,
      severity: "success",
    });
  };

  // Save changes to a payment gateway
  const saveChanges = async () => {
    if (!currentForm) return;

    setIsLoading(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // If changing from default to non-default, ensure another gateway is set as default
      if (
        paymentGateways[tabValue].isDefault &&
        !currentForm.isDefault &&
        !paymentGateways.some((g) => g.id !== currentForm.id && g.enabled)
      ) {
        setSnackbar({
          open: true,
          message: "You must have at least one enabled default payment gateway",
          severity: "error",
        });
        setIsLoading(false);
        return;
      }

      // Update the payment gateways state
      const updatedGateways = paymentGateways.map((gateway) => {
        if (gateway.id === currentForm.id) {
          return {
            ...gateway,
            enabled: currentForm.enabled,
            isDefault: currentForm.isDefault,
            testMode: currentForm.testMode,
            credentials: { ...currentForm.credentials },
            processingFee: currentForm.processingFee,
          };
        }
        // If this gateway is being set as default, make sure others are not default
        if (currentForm.isDefault && gateway.id !== currentForm.id) {
          return {
            ...gateway,
            isDefault: false,
          };
        }
        return gateway;
      });

      setPaymentGateways(updatedGateways);
      setSnackbar({
        open: true,
        message: "Payment gateway settings saved successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save payment gateway settings",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test connection to payment gateway
  const testConnection = async (gatewayId) => {
    if (!currentForm) return;

    // Check if credentials are filled
    const credentials = currentForm.credentials;
    const hasEmptyCredentials = Object.values(credentials).some(
      (value) => !value
    );

    if (hasEmptyCredentials) {
      setSnackbar({
        open: true,
        message: "Please fill all credential fields before testing",
        severity: "warning",
      });
      return;
    }

    setIsTesting(true);

    try {
      // Simulate API call with timeout and random success/failure
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const success = Math.random() > 0.3; // 70% chance of success for demo purposes

      // Update the payment gateways state
      const updatedGateways = paymentGateways.map((gateway) => {
        if (gateway.id === gatewayId) {
          return {
            ...gateway,
            lastTested: {
              date: new Date().toISOString(),
              success,
              message: success
                ? "Connection successful"
                : "Invalid API credentials. Please check and try again.",
            },
          };
        }
        return gateway;
      });

      setPaymentGateways(updatedGateways);
      setSnackbar({
        open: true,
        message: success
          ? "Connection test successful"
          : "Connection test failed. Please check your credentials.",
        severity: success ? "success" : "error",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to test connection",
        severity: "error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Toggle password visibility
  const toggleSecretVisibility = (field) => {
    setShowSecrets({
      ...showSecrets,
      [field]: !showSecrets[field],
    });
  };

  // Handle disabling a payment gateway
  const handleDisableGateway = (gatewayId) => {
    const gateway = paymentGateways.find((g) => g.id === gatewayId);

    // If this is the default gateway, show confirmation dialog
    if (gateway?.isDefault) {
      setConfirmDialog({
        open: true,
        title: "Disable Default Payment Gateway",
        message:
          "This is currently set as your default payment gateway. Disabling it will affect checkout functionality. Are you sure you want to continue?",
        confirmAction: () => {
          handleFormChange("enabled", false);
          handleFormChange("isDefault", false);
          setConfirmDialog({ ...confirmDialog, open: false });
        },
      });
    } else {
      handleFormChange("enabled", false);
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
    <Container maxWidth="xl">
      <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
        <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
          Payment Gateway Settings
        </Typography>

        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Configure payment gateways to process transactions on your platform.
          Enable test mode for development.
        </Typography>

        <Paper 
          sx={{ 
            mb: 3,
            overflow: 'hidden',
            boxShadow: { xs: 1, md: 2 }
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="payment gateway tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minWidth: { xs: 100, sm: 130 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  p: { xs: 1, sm: 2 }
                }
              }}
            >
              {paymentGateways.map((gateway, index) => (
                <Tab
                  key={gateway.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
                      <Typography 
                        sx={{ 
                          display: 'block',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {gateway.name}
                      </Typography>
                      {gateway.enabled && (
                        <Tooltip
                          title={
                            gateway.isDefault
                              ? "Default payment method"
                              : "Enabled"
                          }
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
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
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Gateway Status Section */}
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: { xs: 0, md: 1 } }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: "space-between",
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          mb: { xs: 2, sm: 3 },
                          gap: { xs: 1, sm: 0 }
                        }}
                      >
                        <Box
                          sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1,
                            mb: { xs: 1, sm: 0 }
                          }}
                        >
                          <PaymentIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                            {currentGateway.name} Status
                          </Typography>
                        </Box>

                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={currentForm.enabled}
                                onChange={(e) =>
                                  currentForm.enabled
                                    ? handleDisableGateway(currentForm.id)
                                    : handleFormChange(
                                        "enabled",
                                        e.target.checked
                                      )
                                }
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                {currentForm.enabled ? "Enabled" : "Disabled"}
                              </Typography>
                            }
                          />
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                          >
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Processing Fee:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ml: 1,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}
                            >
                              {currentGateway.processingFee}
                            </Typography>
                          </Box>

                          <Box
                            sx={{ 
                              display: "flex", 
                              alignItems: { xs: "flex-start", sm: "center" },
                              flexDirection: { xs: "column", sm: "row" },
                              mb: 1 
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                            >
                              Supported Countries:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ml: { xs: 0, sm: 1 },
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}
                            >
                              {currentGateway.supportedCountries.length > 3 && isMobile
                                ? `${currentGateway.supportedCountries.slice(0, 3).join(", ")}...`
                                : currentGateway.supportedCountries.join(", ")}
                            </Typography>
                          </Box>

                          {currentGateway.lastTested && (
                            <Box sx={{ 
                              display: "flex", 
                              alignItems: "center",
                              flexWrap: "wrap"
                            }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              >
                                Last Tested:
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  ml: 1,
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {new Date(
                                  currentGateway.lastTested.date
                                ).toLocaleDateString()}{" "}
                                {currentGateway.lastTested.success ? (
                                  <CheckCircleOutlineIcon
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, ml: 0.5 }}
                                    color="success"
                                  />
                                ) : (
                                  <ErrorOutlineIcon
                                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, ml: 0.5 }}
                                    color="error"
                                  />
                                )}
                              </Typography>
                            </Box>
                          )}
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={currentForm.testMode}
                                  onChange={(e) =>
                                    handleFormChange("testMode", e.target.checked)
                                  }
                                  color="primary"
                                  size={isMobile ? "small" : "medium"}
                                />
                              }
                              label={
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                    Test Mode
                                  </Typography>
                                  <Tooltip title="In test mode, no real transactions will be processed">
                                    <HelpOutlineIcon
                                      sx={{ 
                                        ml: 1,
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                      }}
                                    />
                                  </Tooltip>
                                </Box>
                              }
                            />

                            <FormControlLabel
                              control={
                                <Switch
                                  checked={currentForm.isDefault}
                                  onChange={() =>
                                    handleDefaultChange(currentForm.id)
                                  }
                                  color="primary"
                                  disabled={!currentForm.enabled}
                                  size={isMobile ? "small" : "medium"}
                                />
                              }
                              label={
                                <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  Default Payment Method
                                </Typography>
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Credentials Section */}
                <Grid item xs={12}>
                  <Card sx={{ boxShadow: { xs: 0, md: 1 } }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        mb: { xs: 2, sm: 3 }
                      }}>
                        <LockIcon sx={{ 
                          mr: 1,
                          fontSize: { xs: '1.25rem', sm: '1.5rem' }
                        }} />
                        <Typography 
                          variant="h6"
                          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                        >
                          API Credentials
                        </Typography>
                      </Box>

                      <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {Object.keys(currentForm.credentials).map((key) => {
                          const isSecret =
                            key.toLowerCase().includes("secret") ||
                            key.toLowerCase().includes("key") ||
                            key.toLowerCase().includes("token") ||
                            key.toLowerCase().includes("password");

                          return (
                            <Grid item xs={12} md={6} key={key}>
                              <TextField
                                label={key
                                  .split(/(?=[A-Z])/)
                                  .join(" ")
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                                variant="outlined"
                                fullWidth
                                value={currentForm.credentials[key]}
                                onChange={(e) =>
                                  handleFormChange(
                                    `credentials.${key}`,
                                    e.target.value
                                  )
                                }
                                type={
                                  isSecret && !showSecrets[key]
                                    ? "password"
                                    : "text"
                                }
                                size={isMobile ? "small" : "medium"}
                                InputProps={{
                                  endAdornment: isSecret && (
                                    <IconButton
                                      onClick={() => toggleSecretVisibility(key)}
                                      edge="end"
                                      size={isMobile ? "small" : "medium"}
                                    >
                                      {showSecrets[key] ? (
                                        <VisibilityOffIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                      ) : (
                                        <VisibilityIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                      )}
                                    </IconButton>
                                  ),
                                }}
                                InputLabelProps={{
                                  sx: { fontSize: { xs: '0.875rem', sm: '1rem' } }
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: { xs: 'stretch', sm: 'space-between' },
                      gap: { xs: 2, sm: 0 },
                      mt: { xs: 1, sm: 2 },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<RefreshIcon />}
                      onClick={() => testConnection(currentForm.id)}
                      disabled={isTesting || !currentForm.enabled}
                      fullWidth={isMobile}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isTesting ? (
                        <CircularProgress size={isMobile ? 16 : 24} />
                      ) : (
                        "Test Connection"
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={saveChanges}
                      disabled={isLoading}
                      fullWidth={isMobile}
                      size={isMobile ? "small" : "medium"}
                    >
                      {isLoading ? (
                        <CircularProgress size={isMobile ? 16 : 24} />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          )}
        </Paper>

        {/* Alert for no payment gateways */}
        {paymentGateways.length === 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            No payment gateways are configured. Please add at least one payment
            gateway.
          </Alert>
        )}

        {/* Alert for disabled default gateway */}
        {!paymentGateways.some((g) => g.enabled && g.isDefault) && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Warning: No default payment gateway is enabled. Customers will not be
            able to complete checkout.
          </Alert>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ 
            vertical: isMobile ? "bottom" : "bottom", 
            horizontal: isMobile ? "center" : "right" 
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ 
              width: "100%",
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Confirmation Dialog */}
        <Dialog 
          open={confirmDialog.open} 
          onClose={handleCloseConfirmDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {confirmDialog.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {confirmDialog.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseConfirmDialog} 
              color="primary"
              size={isMobile ? "small" : "medium"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => confirmDialog.confirmAction()}
              color="error"
              autoFocus
              size={isMobile ? "small" : "medium"}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PaymentGatewaySetting;