import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ArrowUpward,
  ArrowDownward,
  Equalizer,
  ShoppingCart,
  Store,
  People,
  LocalShipping,
} from "@mui/icons-material";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.15)",
  },
}));

const PerformanceCard = ({ title, value, change, icon, isPositive }) => (
  <StyledCard>
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Box
          color={isPositive ? "success.main" : "error.main"}
          display="flex"
          alignItems="center"
        >
          {isPositive ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          )}
          <Typography variant="caption" ml={0.5}>
            {change}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      <Box mt={2} display="flex" justifyContent="flex-end">
        {icon}
      </Box>
    </CardContent>
  </StyledCard>
);

// Dummy data
const performanceMetrics = [
  {
    title: "Total Orders",
    value: "1,284",
    change: "12.5%",
    icon: <ShoppingCart color="primary" fontSize="large" />,
    isPositive: true,
  },
  {
    title: "Active Stores",
    value: "42",
    change: "5.2%",
    icon: <Store color="secondary" fontSize="large" />,
    isPositive: true,
  },
  {
    title: "New Customers",
    value: "183",
    change: "3.1%",
    icon: <People color="info" fontSize="large" />,
    isPositive: true,
  },
  {
    title: "Delivery Time",
    value: "32 min",
    change: "8.4%",
    icon: <LocalShipping color="warning" fontSize="large" />,
    isPositive: false,
  },
];

const topStores = [
  { id: 1, name: "Fresh Mart", orders: 284, revenue: "$12,840", rating: 4.8 },
  { id: 2, name: "Quick Grocery", orders: 198, revenue: "$9,560", rating: 4.7 },
  {
    id: 3,
    name: "Neighborhood Market",
    orders: 176,
    revenue: "$8,320",
    rating: 4.6,
  },
  { id: 4, name: "Daily Needs", orders: 152, revenue: "$7,120", rating: 4.5 },
  {
    id: 5,
    name: "City Supermarket",
    orders: 134,
    revenue: "$6,480",
    rating: 4.4,
  },
];

const orderStatusData = [
  { status: "Completed", count: 984, percentage: 76.6 },
  { status: "In Progress", count: 184, percentage: 14.3 },
  { status: "Cancelled", count: 68, percentage: 5.3 },
  { status: "Returned", count: 48, percentage: 3.8 },
];

const Performance = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState("week");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="bold">
          Platform Performance
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
          >
            <MenuItem value="day">Last 24h</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
        <Tab label="Overview" />
        <Tab label="Stores" />
        <Tab label="Orders" />
        <Tab label="Customers" />
        <Tab label="Delivery" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Grid container spacing={4} mb={4}>
            {performanceMetrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <PerformanceCard {...metric} />
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Top Performing Stores
                  </Typography>
                  <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Store</TableCell>
                          <TableCell align="right">Orders</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Rating</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topStores.map((store) => (
                          <TableRow key={store.id}>
                            <TableCell>{store.name}</TableCell>
                            <TableCell align="right">{store.orders}</TableCell>
                            <TableCell align="right">{store.revenue}</TableCell>
                            <TableCell align="right">{store.rating}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Order Status Breakdown
                  </Typography>
                  {orderStatusData.map((item, index) => (
                    <Box key={index} mb={2}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={0.5}
                      >
                        <Typography variant="body2">{item.status}</Typography>
                        <Typography variant="body2">
                          {item.count} ({item.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        color={
                          item.status === "Completed"
                            ? "success"
                            : item.status === "In Progress"
                            ? "primary"
                            : item.status === "Cancelled"
                            ? "error"
                            : "warning"
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 1 && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Store Performance Analytics
            </Typography>
            <Box
              height={400}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="action.hover"
              borderRadius={2}
            >
              <Typography color="textSecondary">
                Store performance charts will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      )}

      {tabValue === 2 && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Order Analytics
            </Typography>
            <Box
              height={400}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="action.hover"
              borderRadius={2}
            >
              <Typography color="textSecondary">
                Order analytics charts will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      )}

      {tabValue === 3 && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Customer Insights
            </Typography>
            <Box
              height={400}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="action.hover"
              borderRadius={2}
            >
              <Typography color="textSecondary">
                Customer analytics charts will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      )}

      {tabValue === 4 && (
        <StyledCard>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Delivery Performance
            </Typography>
            <Box
              height={400}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor="action.hover"
              borderRadius={2}
            >
              <Typography color="textSecondary">
                Delivery performance charts will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      )}
    </Box>
  );
};

export default Performance;
