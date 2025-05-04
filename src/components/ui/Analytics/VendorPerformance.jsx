import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Select, MenuItem, FormControl, InputLabel, Table, TableHead, TableRow, TableCell, TableBody, Paper, LinearProgress, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Types
interface Vendor {
  id: string;
  name: string;
  rating: number;
  ordersCompleted: number;
  avgPreparationTime: number;
  revenue: number;
  fulfillmentRate: number;
}

interface OrderMetric {
  date: string;
  orders: number;
  cancellations: number;
}

interface PerformanceMetric {
  month: string;
  revenue: number;
  rating: number;
}

// Dummy data
const vendors: Vendor[] = [
  { id: '1', name: 'Fresh Mart', rating: 4.8, ordersCompleted: 1245, avgPreparationTime: 22, revenue: 125000, fulfillmentRate: 98 },
  { id: '2', name: 'Grocery Palace', rating: 4.5, ordersCompleted: 980, avgPreparationTime: 28, revenue: 98700, fulfillmentRate: 95 },
  { id: '3', name: 'Quick Stop', rating: 4.2, ordersCompleted: 765, avgPreparationTime: 35, revenue: 75600, fulfillmentRate: 92 },
  { id: '4', name: 'Urban Market', rating: 4.6, ordersCompleted: 1100, avgPreparationTime: 25, revenue: 112000, fulfillmentRate: 97 },
  { id: '5', name: 'Corner Store', rating: 4.0, ordersCompleted: 650, avgPreparationTime: 40, revenue: 64500, fulfillmentRate: 90 },
];

const orderMetrics: OrderMetric[] = [
  { date: '2023-01-01', orders: 120, cancellations: 5 },
  { date: '2023-01-02', orders: 145, cancellations: 7 },
  { date: '2023-01-03', orders: 130, cancellations: 3 },
  { date: '2023-01-04', orders: 160, cancellations: 8 },
  { date: '2023-01-05', orders: 180, cancellations: 10 },
  { date: '2023-01-06', orders: 200, cancellations: 12 },
  { date: '2023-01-07', orders: 220, cancellations: 15 },
];

const performanceData: PerformanceMetric[] = [
  { month: 'Jan', revenue: 125000, rating: 4.5 },
  { month: 'Feb', revenue: 135000, rating: 4.6 },
  { month: 'Mar', revenue: 145000, rating: 4.7 },
  { month: 'Apr', revenue: 155000, rating: 4.8 },
  { month: 'May', revenue: 165000, rating: 4.7 },
  { month: 'Jun', revenue: 175000, rating: 4.9 },
];

const VendorPerformance: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2023-01-07'));
  const [timeRange, setTimeRange] = useState<string>('7days');

  const handleVendorChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedVendor(event.target.value as string);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
    // Adjust dates based on time range selection
    const now = new Date();
    if (event.target.value === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      setStartDate(sevenDaysAgo);
      setEndDate(now);
    } else if (event.target.value === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      setStartDate(thirtyDaysAgo);
      setEndDate(now);
    } else if (event.target.value === '90days') {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      setStartDate(ninetyDaysAgo);
      setEndDate(now);
    }
  };

  const filteredVendors = selectedVendor === 'all' 
    ? vendors 
    : vendors.filter(vendor => vendor.id === selectedVendor);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Vendor Performance Analytics
      </Typography>
      
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="vendor-select-label">Vendor</InputLabel>
                <Select
                  labelId="vendor-select-label"
                  value={selectedVendor}
                  label="Vendor"
                  onChange={handleVendorChange}
                >
                  <MenuItem value="all">All Vendors</MenuItem>
                  {vendors.map(vendor => (
                    <MenuItem key={vendor.id} value={vendor.id}>{vendor.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  value={timeRange}
                  label="Time Range"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="90days">Last 90 Days</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {timeRange === 'custom' && (
              <>
                <Grid item xs={12} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Vendors
              </Typography>
              <Typography variant="h4">
                {filteredVendors.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Rating
              </Typography>
              <Typography variant="h4">
                {filteredVendors.reduce((acc, vendor) => acc + vendor.rating, 0) / filteredVendors.length.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4">
                {filteredVendors.reduce((acc, vendor) => acc + vendor.ordersCompleted, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4">
                ${filteredVendors.reduce((acc, vendor) => acc + vendor.revenue, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Orders & Cancellations
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orderMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#8884d8" name="Orders" />
                  <Bar dataKey="cancellations" fill="#82ca9d" name="Cancellations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue & Rating Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#82ca9d" name="Rating" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Vendor Performance Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vendor Performance Details
          </Typography>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor Name</TableCell>
                  <TableCell align="right">Rating</TableCell>
                  <TableCell align="right">Orders Completed</TableCell>
                  <TableCell align="right">Avg. Prep Time (min)</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Fulfillment Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress variant="determinate" value={vendor.rating * 20} color="primary" />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2">{vendor.rating.toFixed(1)}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{vendor.ordersCompleted.toLocaleString()}</TableCell>
                    <TableCell align="right">{vendor.avgPreparationTime}</TableCell>
                    <TableCell align="right">${vendor.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">{vendor.fulfillmentRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VendorPerformance;