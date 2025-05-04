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
} from "@mui/material";
import {
  LocalShipping,
  ShoppingBasket,
  CheckCircle,
  Home,
  Cancel,
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
        <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 3 }}>
          <Cancel color="error" sx={{ mr: 1 }} />
          <Typography variant="h6" color="error">
            Order Cancelled
          </Typography>
        </Box>
      );
    }

    const steps = getStatusSteps();
    const activeStep = getActiveStep(order.status);

    return (
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3, mb: 3 }}>
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
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Your Delivery Person
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 2 }}>{deliveryPerson.name.charAt(0)}</Avatar>
          <Box>
            <Typography>{deliveryPerson.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveryPerson.phone}
            </Typography>
            <Chip
              label={`★ ${deliveryPerson.rating}`}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Order Status
      </Typography>

      {activeOrder ? (
        <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Current Order: #{activeOrder.orderNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Placed on {formatDate(activeOrder.date)}
          </Typography>

          {renderOrderStatusStepper(activeOrder)}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {activeOrder.items.map((item) => (
                  <ListItem key={item.id} sx={{ py: 1 }}>
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
                    />
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1">Total</Typography>
                <Typography variant="subtitle1">
                  ${activeOrder.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Store
                </Typography>
                <Typography variant="body1">{activeOrder.storeName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {activeOrder.storeLocation}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Delivery Address
                </Typography>
                <Typography variant="body1">
                  {activeOrder.deliveryAddress}
                </Typography>
              </Box>

              {activeOrder.status !== "cancelled" && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(activeOrder.estimatedDelivery)}
                  </Typography>
                </Box>
              )}

              {renderDeliveryPersonInfo(activeOrder.deliveryPerson)}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            {activeOrder.status === "cancelled" ? (
              <Button
                variant="contained"
                onClick={() => handleReorder(activeOrder.id)}
                sx={{ minWidth: 120 }}
              >
                Reorder
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={handleContactSupport}
                sx={{ minWidth: 120 }}
              >
                Need Help?
              </Button>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mb: 4, textAlign: "center" }} elevation={3}>
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
          >
            Start Shopping
          </Button>
        </Paper>
      )}

      {pastOrders.length > 0 && (
        <Paper sx={{ p: 3 }} elevation={3}>
          <Typography variant="h6" gutterBottom>
            Order History
          </Typography>

          <List>
            {pastOrders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={`Order #${order.orderNumber}`}
                    secondary={
                      <>
                        <span>Placed on {formatDate(order.date)}</span>
                        <span> • </span>
                        <span>
                          {order.status === "delivered"
                            ? "Delivered"
                            : "Cancelled"}
                        </span>
                      </>
                    }
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <Typography variant="body1">
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
        </Paper>
      )}
    </Box>
  );
};

export default OrderStatusPage;
