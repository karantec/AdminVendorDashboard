import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Chip,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grid,
  Container,
  useMediaQuery,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  LocalShipping,
  ShoppingBasket,
  CheckCircle,
  Home,
  Cancel,
  ExpandMore,
  ArrowBack,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Dummy data
const dummyOrders = [
  {
    id: "1",
    orderNumber: "MIN-2023-00145",
    date: "2023-06-15T10:30:00",
    status: "out-for-delivery",
    items: [
      {
        id: "101",
        name: "Organic Bananas",
        quantity: 2,
        price: 0.99,
        image: "/images/bananas.jpg",
      },
      {
        id: "102",
        name: "Whole Grain Bread",
        quantity: 1,
        price: 3.49,
        image: "/images/bread.jpg",
      },
      {
        id: "103",
        name: "Almond Milk",
        quantity: 1,
        price: 2.99,
        image: "/images/almond-milk.jpg",
      },
    ],
    totalAmount: 8.46,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    estimatedDelivery: "2023-06-15T13:45:00",
    storeName: "FreshMart Grocery",
    storeLocation: "0.8 miles away",
    deliveryPerson: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      rating: 4.8,
    },
  },
  {
    id: "2",
    orderNumber: "MIN-2023-00144",
    date: "2023-06-14T18:15:00",
    status: "delivered",
    items: [
      {
        id: "201",
        name: "Chicken Breast",
        quantity: 1,
        price: 8.99,
        image: "/images/chicken.jpg",
      },
      {
        id: "202",
        name: "Broccoli",
        quantity: 2,
        price: 1.49,
        image: "/images/broccoli.jpg",
      },
    ],
    totalAmount: 11.97,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    estimatedDelivery: "2023-06-14T19:30:00",
    storeName: "FreshMart Grocery",
    storeLocation: "0.8 miles away",
  },
  {
    id: "3",
    orderNumber: "MIN-2023-00143",
    date: "2023-06-13T09:45:00",
    status: "cancelled",
    items: [
      {
        id: "301",
        name: "Avocados",
        quantity: 3,
        price: 1.29,
        image: "/images/avocados.jpg",
      },
      {
        id: "302",
        name: "Tomatoes",
        quantity: 6,
        price: 0.79,
        image: "/images/tomatoes.jpg",
      },
    ],
    totalAmount: 8.01,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    estimatedDelivery: "2023-06-13T11:30:00",
    storeName: "FreshMart Grocery",
    storeLocation: "0.8 miles away",
  },
];

const OrderStatusPage = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [pastOrders, setPastOrders] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Simulate API fetch
    const active = dummyOrders.find(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    );
    const past = dummyOrders.filter(
      (order) => order.status === "delivered" || order.status === "cancelled"
    );

    setActiveOrder(active || null);
    setPastOrders(past);
  }, []);

  const getStatusSteps = () => {
    return [
      { label: "Order Placed", icon: <ShoppingBasket />, status: "pending" },
      { label: "Order Confirmed", icon: <CheckCircle />, status: "confirmed" },
      { label: "Preparing", icon: <Home />, status: "preparing" },
      {
        label: "Out for Delivery",
        icon: <LocalShipping />,
        status: "out-for-delivery",
      },
      { label: "Delivered", icon: <CheckCircle />, status: "delivered" },
    ];
  };

  const getActiveStep = (status) => {
    const statusOrder = [
      "pending",
      "confirmed",
      "preparing",
      "out-for-delivery",
      "delivered",
    ];
    return statusOrder.indexOf(status);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleReorder = (orderId) => {
    console.log("Reordering:", orderId);
    navigate("/cart");
  };

  const handleContactSupport = () => {
    console.log("Contacting support");
  };

  const renderOrderStatusStepper = (order) => {
    if (order.status === "cancelled") {
      return (
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            mt: 2, 
            mb: 3,
            justifyContent: isMobile ? "center" : "flex-start" 
          }}
        >
          <Cancel color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" color="error">
            Order Cancelled
          </Typography>
        </Box>
      );
    }

    const steps = getStatusSteps();
    const activeStep = getActiveStep(order.status);

    if (isMobile) {
      // Mobile view - vertical timeline-like display
      return (
        <Box sx={{ mt: 3, mb: 3 }}>
          {steps.map((step, index) => {
            const isCompleted = index <= activeStep;
            return (
              <Box 
                key={step.label} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 2,
                  opacity: isCompleted ? 1 : 0.5
                }}
              >
                <Box 
                  sx={{ 
                    mr: 2, 
                    bgcolor: isCompleted ? theme.palette.primary.main : 'grey.400',
                    color: "#fff",
                    p: 1,
                    borderRadius: '50%',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="body1">{step.label}</Typography>
              </Box>
            );
          })}
        </Box>
      );
    }

    // Desktop view - horizontal stepper
    return (
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ 
          mt: 3, 
          mb: 3,
          "& .MuiStepConnector-line": {
            minHeight: "1px"
          }
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel icon={step.icon}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };

  const renderDeliveryPersonInfo = (deliveryPerson) => {
    if (!deliveryPerson) return null;

    return (
      <Card sx={{ mt: 3, p: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Your Delivery Person
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2, width: 50, height: 50 }}>
              {deliveryPerson.name.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography fontWeight="bold">{deliveryPerson.name}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Phone sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {deliveryPerson.phone}
                </Typography>
              </Box>
              <Chip
                label={`★ ${deliveryPerson.rating}`}
                size="small"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <IconButton color="primary" size="large">
              <Phone />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderOrderSummary = (order) => {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Order Summary
        </Typography>
        {isMobile ? (
          <List disablePadding>
            {order.items.map((item) => (
              <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Qty: ${item.quantity} x $${item.price.toFixed(2)}`}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
                <Typography variant="body2" fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <List disablePadding>
            {order.items.map((item) => (
              <ListItem key={item.id} sx={{ py: 1.5, px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    variant="rounded"
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`Quantity: ${item.quantity}`}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
                <Typography variant="body2" fontWeight="bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ${order.totalAmount.toFixed(2)}
          </Typography>
        </Box>
      </>
    );
  };

  const renderDeliveryInfo = (order) => {
    return (
      <>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Delivery Information
        </Typography>

        <Card sx={{ mb: 2, p: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Home sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Store
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {order.storeName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {order.storeLocation}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, p: 1 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <LocalShipping sx={{ mr: 1.5, color: theme.palette.primary.main }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Delivery Address
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {order.deliveryAddress}
                </Typography>
                
                {order.status !== "cancelled" && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Delivery
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(order.estimatedDelivery)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </>
    );
  };

  const renderPastOrdersList = () => {
    if (isMobile) {
      return pastOrders.map((order) => (
        <Accordion key={order.id} sx={{ mb: 2 }} elevation={2}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box>
              <Typography variant="subtitle2">{`Order #${order.orderNumber}`}</Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                {formatDate(order.date)}
                <Chip 
                  size="small" 
                  label={order.status === "delivered" ? "Delivered" : "Cancelled"}
                  color={order.status === "delivered" ? "success" : "error"}
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 'bold' }}>
              ${order.totalAmount.toFixed(2)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {order.items.map((item) => (
                <ListItem key={item.id} sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={`${item.quantity}x ${item.name}`}
                    secondary={`$${item.price.toFixed(2)} each`}
                  />
                </ListItem>
              ))}
            </List>
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={() => handleReorder(order.id)}
            >
              Reorder
            </Button>
          </AccordionDetails>
        </Accordion>
      ));
    }

    return (
      <List>
        {pastOrders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem sx={{ py: 2 }}>
              <ListItemText
                primary={`Order #${order.orderNumber}`}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="body2" component="span">
                      {formatDate(order.date)}
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ mx: 0.5 }}>•</Typography>
                    <Chip 
                      size="small" 
                      label={order.status === "delivered" ? "Delivered" : "Cancelled"}
                      color={order.status === "delivered" ? "success" : "error"}
                      sx={{ height: 24 }}
                    />
                  </Box>
                }
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  ${order.totalAmount.toFixed(2)}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={() => handleReorder(order.id)}
                >
                  Reorder
                </Button>
              </Box>
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <IconButton edge="start" sx={{ mr: 1 }} onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          Order Status
        </Typography>
      </Box>

      {activeOrder ? (
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 4 }} elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Current Order: #{activeOrder.orderNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Placed on {formatDate(activeOrder.date)}
              </Typography>
            </Box>
            {!isMobile && activeOrder.status !== "cancelled" && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleContactSupport}
                startIcon={<Phone />}
              >
                Need Help?
              </Button>
            )}
          </Box>

          {renderOrderStatusStepper(activeOrder)}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderOrderSummary(activeOrder)}
            </Grid>

            <Grid item xs={12} md={6}>
              {renderDeliveryInfo(activeOrder)}
              {renderDeliveryPersonInfo(activeOrder.deliveryPerson)}
            </Grid>
          </Grid>

          {isMobile && (
            <Box sx={{ mt: 3 }}>
              {activeOrder.status === "cancelled" ? (
                <Button
                  variant="contained"
                  onClick={() => handleReorder(activeOrder.id)}
                  fullWidth
                >
                  Reorder
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleContactSupport}
                  fullWidth
                  startIcon={<Phone />}
                >
                  Need Help?
                </Button>
              )}
            </Box>
          )}
          
          {!isMobile && activeOrder.status === "cancelled" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => handleReorder(activeOrder.id)}
              >
                Reorder
              </Button>
            </Box>
          )}
        </Paper>
      ) : (
        <Paper sx={{ p: { xs: 3, sm: 4 }, mb: 4, textAlign: "center" }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            No Active Orders
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You don't have any orders in progress right now.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
            size={isMobile ? "large" : "medium"}
          >
            Start Shopping
          </Button>
        </Paper>
      )}

      {pastOrders.length > 0 && (
        <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>
          {renderPastOrdersList()}
        </Paper>
      )}
    </Container>
  );
};

export default OrderStatusPage;