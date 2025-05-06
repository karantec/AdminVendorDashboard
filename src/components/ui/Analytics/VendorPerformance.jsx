import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from "recharts";

// Dummy data
const vendors = [
  {
    id: "1",
    name: "Fresh Mart",
    rating: 4.8,
    ordersCompleted: 1245,
    avgPreparationTime: 22,
    revenue: 125000,
    fulfillmentRate: 98,
  },
  {
    id: "2",
    name: "Grocery Palace",
    rating: 4.5,
    ordersCompleted: 980,
    avgPreparationTime: 28,
    revenue: 98700,
    fulfillmentRate: 95,
  },
  {
    id: "3",
    name: "Quick Stop",
    rating: 4.2,
    ordersCompleted: 765,
    avgPreparationTime: 35,
    revenue: 75600,
    fulfillmentRate: 92,
  },
  {
    id: "4",
    name: "Urban Market",
    rating: 4.6,
    ordersCompleted: 1100,
    avgPreparationTime: 25,
    revenue: 112000,
    fulfillmentRate: 97,
  },
  {
    id: "5",
    name: "Corner Store",
    rating: 4.0,
    ordersCompleted: 650,
    avgPreparationTime: 40,
    revenue: 64500,
    fulfillmentRate: 90,
  },
];

const orderMetrics = [
  { date: "2023-01-01", orders: 120, cancellations: 5 },
  { date: "2023-01-02", orders: 145, cancellations: 7 },
  { date: "2023-01-03", orders: 130, cancellations: 3 },
  { date: "2023-01-04", orders: 160, cancellations: 8 },
  { date: "2023-01-05", orders: 180, cancellations: 10 },
  { date: "2023-01-06", orders: 200, cancellations: 12 },
  { date: "2023-01-07", orders: 220, cancellations: 15 },
];

const performanceData = [
  { month: "Jan", revenue: 125000, rating: 4.5 },
  { month: "Feb", revenue: 135000, rating: 4.6 },
  { month: "Mar", revenue: 145000, rating: 4.7 },
  { month: "Apr", revenue: 155000, rating: 4.8 },
  { month: "May", revenue: 165000, rating: 4.7 },
  { month: "Jun", revenue: 175000, rating: 4.9 },
];

const VendorPerformance = () => {
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [timeRange, setTimeRange] = useState("7days");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-01-07");

  const handleVendorChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    // Adjust dates based on time range selection
    const now = new Date();
    if (event.target.value === "7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (event.target.value === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    } else if (event.target.value === "90days") {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);
      setStartDate(ninetyDaysAgo.toISOString().split('T')[0]);
      setEndDate(now.toISOString().split('T')[0]);
    }
  };

  const filteredVendors =
    selectedVendor === "all"
      ? vendors
      : vendors.filter((vendor) => vendor.id === selectedVendor);
      
  // Calculate summary metrics
  const avgRating = (filteredVendors.reduce((acc, vendor) => acc + vendor.rating, 0) / filteredVendors.length).toFixed(1);
  const totalOrders = filteredVendors.reduce((acc, vendor) => acc + vendor.ordersCompleted, 0);
  const totalRevenue = filteredVendors.reduce((acc, vendor) => acc + vendor.revenue, 0);

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Vendor Performance Analytics
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              value={selectedVendor}
              onChange={handleVendorChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {timeRange === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Vendors</p>
          <p className="text-2xl font-bold">{filteredVendors.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Avg. Rating</p>
          <p className="text-2xl font-bold">{avgRating}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Orders & Cancellations</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Revenue & Rating Trend</h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rating"
                  stroke="#82ca9d"
                  name="Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vendor Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Vendor Performance Details</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Prep Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${vendor.rating * 20}%` }}
                        ></div>
                      </div>
                      <span>{vendor.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {vendor.ordersCompleted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {vendor.avgPreparationTime} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    ${vendor.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {vendor.fulfillmentRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorPerformance;