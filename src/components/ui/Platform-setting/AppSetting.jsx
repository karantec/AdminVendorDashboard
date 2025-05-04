import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  AlertTitle,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  NotificationsActive as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  LocalShipping as DeliveryIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Dummy data for settings
const initialSettings = {
  general: {
    platformName: "Minutos",
    supportEmail: "support@minutos.com",
    contactPhone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    currency: "USD",
    defaultLanguage: "en",
    maintainanceMode: false,
  },
  notifications: {
    enablePush: true,
    enableEmail: true,
    enableSMS: false,
    orderUpdateNotifications: true,
    promotionalNotifications: true,
    deliveryNotifications: true,
    newStoreNotifications: false,
  },
  delivery: {
    defaultDeliveryRadius: 5,
    maxDeliveryRadius: 10,
    minOrderForFreeDelivery: 25,
    standardDeliveryFee: 3.99,
    expressDeliveryFee: 5.99,
    enableExpressDelivery: true,
    deliveryTimeSlot: 30, // in minutes
  },
  payment: {
    enableCreditCard: true,
    enablePayPal: true,
    enableApplePay: true,
    enableGooglePay: true,
    enableCashOnDelivery: true,
    defaultPaymentMethod: "credit_card",
    minimumOrderAmount: 10,
    serviceFeePercentage: 5,
  },
  store: {
    autoApproveStores: false,
    storeCommissionRate: 10, // percentage
    minProductsPerStore: 10,
    enableRatings: true,
    enableStoreChat: true,
    storeOnboardingSteps: 5,
    requiredDocumentsForStores: [
      "Business License",
      "ID Proof",
      "Address Proof",
    ],
  },
  security: {
    twoFactorAuthentication: false,
    passwordExpiryDays: 90,
    sessionTimeout: 60, // minutes
    ipWhitelisting: false,
    dataEncryption: true,
    loginAttempts: 5,
    captchaOnLogin: true,
  },
};

const AppSetting = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [tabValue, setTabValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (section, setting, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSnackbar({
        open: true,
        message: "Settings saved successfully!",
        severity: "success",
      });
    }, 1500);
  };

  const handleResetSettings = () => {
    setSettings(initialSettings);
    setSnackbar({
      open: true,
      message: "Settings have been reset to default values",
      severity: "info",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Platform Settings
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleResetSettings}
            sx={{ mr: 2 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<StoreIcon />} label="General" iconPosition="start" />
          <Tab
            icon={<NotificationsIcon />}
            label="Notifications"
            iconPosition="start"
          />
          <Tab icon={<DeliveryIcon />} label="Delivery" iconPosition="start" />
          <Tab icon={<PaymentIcon />} label="Payment" iconPosition="start" />
          <Tab
            icon={<StoreIcon />}
            label="Store Management"
            iconPosition="start"
          />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
        </Tabs>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Platform Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure basic settings for your Minutos grocery platform
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Platform Name"
                    value={settings.general.platformName}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "platformName",
                        e.target.value
                      )
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Support Email"
                    value={settings.general.supportEmail}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "supportEmail",
                        e.target.value
                      )
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={settings.general.contactPhone}
                    onChange={(e) =>
                      handleSettingChange(
                        "general",
                        "contactPhone",
                        e.target.value
                      )
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.general.timezone}
                      label="Timezone"
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "timezone",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="UTC-12">UTC-12</MenuItem>
                      <MenuItem value="UTC-11">UTC-11</MenuItem>
                      <MenuItem value="UTC-10">UTC-10</MenuItem>
                      <MenuItem value="UTC-9">UTC-9</MenuItem>
                      <MenuItem value="UTC-8">UTC-8 (PST)</MenuItem>
                      <MenuItem value="UTC-7">UTC-7 (MST)</MenuItem>
                      <MenuItem value="UTC-6">UTC-6 (CST)</MenuItem>
                      <MenuItem value="UTC-5">UTC-5 (EST)</MenuItem>
                      <MenuItem value="UTC-4">UTC-4</MenuItem>
                      <MenuItem value="UTC-3">UTC-3</MenuItem>
                      <MenuItem value="UTC-2">UTC-2</MenuItem>
                      <MenuItem value="UTC-1">UTC-1</MenuItem>
                      <MenuItem value="UTC+0">UTC+0</MenuItem>
                      <MenuItem value="UTC+1">UTC+1 (CET)</MenuItem>
                      <MenuItem value="UTC+2">UTC+2</MenuItem>
                      <MenuItem value="UTC+3">UTC+3</MenuItem>
                      <MenuItem value="UTC+4">UTC+4</MenuItem>
                      <MenuItem value="UTC+5">UTC+5</MenuItem>
                      <MenuItem value="UTC+5:30">UTC+5:30 (IST)</MenuItem>
                      <MenuItem value="UTC+6">UTC+6</MenuItem>
                      <MenuItem value="UTC+7">UTC+7</MenuItem>
                      <MenuItem value="UTC+8">UTC+8</MenuItem>
                      <MenuItem value="UTC+9">UTC+9</MenuItem>
                      <MenuItem value="UTC+10">UTC+10</MenuItem>
                      <MenuItem value="UTC+11">UTC+11</MenuItem>
                      <MenuItem value="UTC+12">UTC+12</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.general.currency}
                      label="Currency"
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "currency",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="USD">USD - US Dollar</MenuItem>
                      <MenuItem value="EUR">EUR - Euro</MenuItem>
                      <MenuItem value="GBP">GBP - British Pound</MenuItem>
                      <MenuItem value="CAD">CAD - Canadian Dollar</MenuItem>
                      <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                      <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                      <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Default Language</InputLabel>
                    <Select
                      value={settings.general.defaultLanguage}
                      label="Default Language"
                      onChange={(e) =>
                        handleSettingChange(
                          "general",
                          "defaultLanguage",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="it">Italian</MenuItem>
                      <MenuItem value="pt">Portuguese</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                      <MenuItem value="ja">Japanese</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.general.maintainanceMode}
                        onChange={(e) =>
                          handleSettingChange(
                            "general",
                            "maintainanceMode",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Maintenance Mode
                        <Tooltip title="When enabled, users will see a maintenance page instead of the platform">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure how and when notifications are sent to users and
                stores
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notification Channels
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.enablePush}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "enablePush",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.enableEmail}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "enableEmail",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.enableSMS}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "enableSMS",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Notification Types
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          settings.notifications.orderUpdateNotifications
                        }
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "orderUpdateNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Order Updates"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          settings.notifications.promotionalNotifications
                        }
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "promotionalNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Promotional Messages"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.deliveryNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "deliveryNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Delivery Status Updates"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.newStoreNotifications}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            "newStoreNotifications",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="New Store Announcements"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Delivery Settings */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure delivery options, fees, and restrictions
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Default Delivery Radius (km)
                  </Typography>
                  <Slider
                    value={settings.delivery.defaultDeliveryRadius}
                    onChange={(_, value) =>
                      handleSettingChange(
                        "delivery",
                        "defaultDeliveryRadius",
                        value
                      )
                    }
                    step={0.5}
                    marks
                    min={1}
                    max={20}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>
                    Maximum Delivery Radius (km)
                  </Typography>
                  <Slider
                    value={settings.delivery.maxDeliveryRadius}
                    onChange={(_, value) =>
                      handleSettingChange(
                        "delivery",
                        "maxDeliveryRadius",
                        value
                      )
                    }
                    step={0.5}
                    marks
                    min={1}
                    max={30}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Order for Free Delivery ($)"
                    type="number"
                    value={settings.delivery.minOrderForFreeDelivery}
                    onChange={(e) =>
                      handleSettingChange(
                        "delivery",
                        "minOrderForFreeDelivery",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Standard Delivery Fee ($)"
                    type="number"
                    value={settings.delivery.standardDeliveryFee}
                    onChange={(e) =>
                      handleSettingChange(
                        "delivery",
                        "standardDeliveryFee",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Express Delivery Fee ($)"
                    type="number"
                    value={settings.delivery.expressDeliveryFee}
                    onChange={(e) =>
                      handleSettingChange(
                        "delivery",
                        "expressDeliveryFee",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Delivery Time Slot (minutes)</InputLabel>
                    <Select
                      value={settings.delivery.deliveryTimeSlot}
                      label="Delivery Time Slot (minutes)"
                      onChange={(e) =>
                        handleSettingChange(
                          "delivery",
                          "deliveryTimeSlot",
                          Number(e.target.value)
                        )
                      }
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={45}>45 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={90}>1.5 hours</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.delivery.enableExpressDelivery}
                        onChange={(e) =>
                          handleSettingChange(
                            "delivery",
                            "enableExpressDelivery",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Enable Express Delivery Option"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Payment Settings */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure payment methods, fees, and minimum order amounts
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.enableCreditCard}
                        onChange={(e) =>
                          handleSettingChange(
                            "payment",
                            "enableCreditCard",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Credit/Debit Card"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.enablePayPal}
                        onChange={(e) =>
                          handleSettingChange(
                            "payment",
                            "enablePayPal",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="PayPal"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.enableApplePay}
                        onChange={(e) =>
                          handleSettingChange(
                            "payment",
                            "enableApplePay",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Apple Pay"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.enableGooglePay}
                        onChange={(e) =>
                          handleSettingChange(
                            "payment",
                            "enableGooglePay",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Google Pay"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.enableCashOnDelivery}
                        onChange={(e) =>
                          handleSettingChange(
                            "payment",
                            "enableCashOnDelivery",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Cash on Delivery"
                  />
                </Grid>

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Payment Configuration
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Default Payment Method</InputLabel>
                    <Select
                      value={settings.payment.defaultPaymentMethod}
                      label="Default Payment Method"
                      onChange={(e) =>
                        handleSettingChange(
                          "payment",
                          "defaultPaymentMethod",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="credit_card">Credit/Debit Card</MenuItem>
                      <MenuItem value="paypal">PayPal</MenuItem>
                      <MenuItem value="apple_pay">Apple Pay</MenuItem>
                      <MenuItem value="google_pay">Google Pay</MenuItem>
                      <MenuItem value="cash_on_delivery">
                        Cash on Delivery
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Order Amount ($)"
                    type="number"
                    value={settings.payment.minimumOrderAmount}
                    onChange={(e) =>
                      handleSettingChange(
                        "payment",
                        "minimumOrderAmount",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Service Fee Percentage (%)"
                    type="number"
                    value={settings.payment.serviceFeePercentage}
                    onChange={(e) =>
                      handleSettingChange(
                        "payment",
                        "serviceFeePercentage",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{
                      inputProps: { min: 0, max: 100, step: 0.01 },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Store Management Settings */}
        <TabPanel value={tabValue} index={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Store Management Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure store onboarding, commissions, and requirements
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.store.autoApproveStores}
                        onChange={(e) =>
                          handleSettingChange(
                            "store",
                            "autoApproveStores",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Auto-Approve New Stores
                        <Tooltip title="When enabled, new stores will be automatically approved without admin review">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Store Commission Rate (%)"
                    type="number"
                    value={settings.store.storeCommissionRate}
                    onChange={(e) =>
                      handleSettingChange(
                        "store",
                        "storeCommissionRate",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Minimum Products Per Store"
                    type="number"
                    value={settings.store.minProductsPerStore}
                    onChange={(e) =>
                      handleSettingChange(
                        "store",
                        "minProductsPerStore",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.store.enableRatings}
                        onChange={(e) =>
                          handleSettingChange(
                            "store",
                            "enableRatings",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Enable Store & Product Ratings"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.store.enableStoreChat}
                        onChange={(e) =>
                          handleSettingChange(
                            "store",
                            "enableStoreChat",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Enable Customer-Store Chat"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Store Onboarding Steps"
                    type="number"
                    value={settings.store.storeOnboardingSteps}
                    onChange={(e) =>
                      handleSettingChange(
                        "store",
                        "storeOnboardingSteps",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Required Documents for Store Registration
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {settings.store.requiredDocumentsForStores.map(
                      (doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          onDelete={() => {
                            const newDocs = [
                              ...settings.store.requiredDocumentsForStores,
                            ];
                            newDocs.splice(index, 1);
                            handleSettingChange(
                              "store",
                              "requiredDocumentsForStores",
                              newDocs
                            );
                          }}
                        />
                      )
                    )}
                  </Box>
                  <Box sx={{ display: "flex", mt: 2 }}>
                    <TextField
                      label="Add Document Type"
                      size="small"
                      id="new-document"
                    />
                    <Button
                      variant="contained"
                      sx={{ ml: 1 }}
                      onClick={() => {
                        const input = document.getElementById("new-document");
                        if (input && input.value) {
                          const newDocs = [
                            ...settings.store.requiredDocumentsForStores,
                            input.value,
                          ];
                          handleSettingChange(
                            "store",
                            "requiredDocumentsForStores",
                            newDocs
                          );
                          input.value = "";
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Configure security options for the platform
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactorAuthentication}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "twoFactorAuthentication",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Require Two-Factor Authentication
                        <Tooltip title="When enabled, all admin users will be required to use 2FA">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.captchaOnLogin}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "captchaOnLogin",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Enable CAPTCHA on Login"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password Expiry (days)"
                    type="number"
                    value={settings.security.passwordExpiryDays}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "passwordExpiryDays",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 0 } }}
                    helperText="0 for never expire"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "sessionTimeout",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maximum Login Attempts"
                    type="number"
                    value={settings.security.loginAttempts}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "loginAttempts",
                        Number(e.target.value)
                      )
                    }
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.dataEncryption}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "dataEncryption",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Enhanced Data Encryption
                        <Tooltip title="When enabled, all sensitive data will be encrypted with additional security layers">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.ipWhitelisting}
                        onChange={(e) =>
                          handleSettingChange(
                            "security",
                            "ipWhitelisting",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        IP Whitelisting for Admin Panel
                        <Tooltip title="When enabled, admin panel can only be accessed from whitelisted IP addresses">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Security Best Practices</AlertTitle>
                    For optimal platform security, we recommend enabling
                    two-factor authentication, setting a reasonable password
                    expiry period, and limiting login attempts.
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Snackbar for showing save status */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppSetting;
