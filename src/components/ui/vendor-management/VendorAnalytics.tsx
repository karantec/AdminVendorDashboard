import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Types
interface Vendor {
  id: string;
  name: string;
}

interface AnalyticsData {
  sales: {
    date: string;
    total: number;
  }[];
  orders: {
    status: string;
    count: number;
  }[];
  popularProducts: {
    name: string;
    sales: number;
  }[];
  revenueTrend: {
    month: string;
    revenue: number;
  }[];
  customerStats: {
    newCustomers: number;
    returningCustomers: number;
  };
}

// Dummy data
const dummyVendors: Vendor[] = [
  { id: '1', name: 'Fresh Mart' },
  { id: '2', name: 'Grocery Palace' },
  { id: '3', name: 'Organic Heaven' },
  { id: '4', name: 'Quick Stop Market' },
];

const dummyAnalyticsData: AnalyticsData = {
  sales: [
    { date: '2023-01-01', total: 1200 },
    { date: '2023-01-02', total: 1900 },
    { date: '2023-01-03', total: 1500 },
    { date: '2023-01-04', total: 2100 },
    { date: '2023-01-05', total: 1800 },
    { date: '2023-01-06', total: 2500 },
    { date: '2023-01-07', total: 2200 },
  ],
  orders: [
    { status: 'Completed', count: 125 },
    { status: 'Pending', count: 25 },
    { status: 'Cancelled', count: 10 },
    { status: 'Refunded', count: 5 },
  ],
  popularProducts: [
    { name: 'Organic Apples', sales: 320 },
    { name: 'Whole Wheat Bread', sales: 280 },
    { name: 'Free Range Eggs', sales: 250 },
    { name: 'Almond Milk', sales: 210 },
    { name: 'Avocados', sales: 190 },
  ],
  revenueTrend: [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 7000 },
  ],
  customerStats: {
    newCustomers: 45,
    returningCustomers: 120
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const VendorAnalytics: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<string>(dummyVendors[0].id);
  const [startDate, setStartDate] = useState<Date | null>(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2023-01-07'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // In a real app, you would fetch data based on selected vendor and date range
  const [analyticsData] = useState<AnalyticsData>(dummyAnalyticsData);

  const handleVendorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedVendor(event.target.value as string);
    // Here you would typically fetch new data for the selected vendor
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500); // Simulate loading
  };

  const handleDateChange = (newValue: Date | null, isStartDate: boolean) => {
    if (isStartDate) {
      setStartDate(newValue);
    } else {
      setEndDate(newValue);
    }
    // Here you would typically refetch data with new date range
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Analytics
      </Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="vendor-select-label">Select Vendor</InputLabel>
                <Select
                  labelId="vendor-select-label"
                  value={selectedVendor}
                  label="Select Vendor"
                  onChange={handleVendorChange}
                >
                  {dummyVendors.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => handleDateChange(newValue, true)}
                  maxDate={endDate || undefined}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => handleDateChange(newValue, false)}
                  minDate={startDate || undefined}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4">
                    ${analyticsData.sales.reduce((sum, day) => sum + day.total, 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">
                    {analyticsData.orders.reduce((sum, order) => sum + order.count, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Customer Retention
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(
                      (analyticsData.customerStats.returningCustomers /
                        (analyticsData.customerStats.returningCustomers +
                          analyticsData.customerStats.newCustomers)) *
                        100
                    )}
                    %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Daily Sales */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Daily Sales
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.sales}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" name="Sales ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Status */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.orders}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="status"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.orders.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue Trend */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trend (Last 6 Months)
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.revenueTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Revenue ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Popular Products */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Selling Products
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.popularProducts}
                        layout="vertical"
                        margin={{ left: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default VendorAnalytics;