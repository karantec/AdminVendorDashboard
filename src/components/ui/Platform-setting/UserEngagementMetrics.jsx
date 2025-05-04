import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart2,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Clock,
  ShoppingCart,
  Users,
  ExternalLink,
  Download,
  Filter,
} from "lucide-react";

// Dummy data for charts
const userMetrics = [
  { name: "Total Users", value: 12458 },
  { name: "Active Users", value: 8245 },
  { name: "New Users (This Month)", value: 1536 },
  { name: "Average Orders Per User", value: 7 },
];

const timeSeriesData = [
  { date: "Jan", newUsers: 400, activeUsers: 2400, orders: 1200 },
  { date: "Feb", newUsers: 300, activeUsers: 1398, orders: 980 },
  { date: "Mar", newUsers: 200, activeUsers: 3800, orders: 1400 },
  { date: "Apr", newUsers: 278, activeUsers: 3908, orders: 1700 },
  { date: "May", newUsers: 189, activeUsers: 4800, orders: 2100 },
  { date: "Jun", newUsers: 239, activeUsers: 3800, orders: 1500 },
  { date: "Jul", newUsers: 349, activeUsers: 4300, orders: 1900 },
  { date: "Aug", newUsers: 568, activeUsers: 4900, orders: 2300 },
  { date: "Sep", newUsers: 467, activeUsers: 5100, orders: 2500 },
  { date: "Oct", newUsers: 610, activeUsers: 5200, orders: 2700 },
  { date: "Nov", newUsers: 374, activeUsers: 4900, orders: 2400 },
  { date: "Dec", newUsers: 598, activeUsers: 5300, orders: 2800 },
];

const productCategories = [
  { name: "Fruits & Vegetables", value: 35 },
  { name: "Dairy & Eggs", value: 25 },
  { name: "Bakery", value: 15 },
  { name: "Meat & Seafood", value: 12 },
  { name: "Frozen Foods", value: 8 },
  { name: "Snacks", value: 5 },
];

const deviceData = [
  { name: "Mobile", value: 65 },
  { name: "Desktop", value: 25 },
  { name: "Tablet", value: 10 },
];

const timeSpentData = [
  { range: "0-2 min", count: 1245 },
  { range: "2-5 min", count: 2456 },
  { range: "5-10 min", count: 3678 },
  { range: "10-15 min", count: 1987 },
  { range: "15+ min", count: 876 },
];

// Color configurations
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];
const deviceColors = ["#FF6384", "#36A2EB", "#FFCE56"];

const UserEngagementMetrics = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDateRangeChange = (e) => {
    setIsLoading(true);
    setDateRange(e.target.value);

    // Simulate data reload when changing date range
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleExportData = () => {
    alert("Exporting data...");
    // In a real app, this would trigger a CSV or PDF download
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          User Engagement Metrics
        </h1>
        <p className="text-gray-600 mt-1">
          Analyze user activity and engagement patterns on Minutos platform
        </p>
      </div>

      {/* Controls and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <span className="mr-2 text-gray-700">Time Period:</span>
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateRange === "custom" && (
            <div className="flex ml-4 items-center gap-2">
              <input
                type="date"
                className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span>to</span>
              <input
                type="date"
                className="border rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              {index === 0 && <Users className="h-6 w-6 text-blue-500 mr-2" />}
              {index === 1 && (
                <Activity className="h-6 w-6 text-green-500 mr-2" />
              )}
              {index === 2 && (
                <Calendar className="h-6 w-6 text-purple-500 mr-2" />
              )}
              {index === 3 && (
                <ShoppingCart className="h-6 w-6 text-orange-500 mr-2" />
              )}
              <h2 className="text-lg font-medium text-gray-700">
                {metric.name}
              </h2>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">
                {metric.name.includes("Average")
                  ? metric.value.toFixed(1)
                  : metric.value.toLocaleString()}
              </p>
              <div className="flex items-center text-sm">
                <span className="text-green-500 font-medium flex items-center">
                  +{Math.floor(Math.random() * 10) + 5}%
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs previous period</p>
          </div>
        ))}
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">User Growth</h2>
            </div>
            <div className="text-sm text-gray-500">
              <select className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#82ca9d"
                name="Active Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Activity Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingCart className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-800">
                Order Activity
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              <select className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#FF8042" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Product Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <PieChartIcon className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Popular Categories
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {productCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Device Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Activity className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">Device Usage</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={deviceColors[index % deviceColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Time Spent Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              Session Duration
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={timeSpentData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Usage Times */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-6">
          <Activity className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">
            Daily Activity Patterns
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { hour: "12 AM", users: 258 },
              { hour: "2 AM", users: 124 },
              { hour: "4 AM", users: 85 },
              { hour: "6 AM", users: 167 },
              { hour: "8 AM", users: 589 },
              { hour: "10 AM", users: 856 },
              { hour: "12 PM", users: 1245 },
              { hour: "2 PM", users: 875 },
              { hour: "4 PM", users: 967 },
              { hour: "6 PM", users: 1452 },
              { hour: "8 PM", users: 1678 },
              { hour: "10 PM", users: 745 },
            ]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#82ca9d"
              name="Active Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Retention and Cohort Analysis Preview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-800">
              User Retention Preview
            </h2>
          </div>
          <button
            className="text-blue-600 flex items-center hover:text-blue-800"
            onClick={() =>
              alert("Navigating to detailed retention analysis...")
            }
          >
            <span className="mr-1">Full Analysis</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cohort
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 3
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week 4
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {["January", "February", "March", "April", "May"].map(
                (month, idx) => (
                  <tr key={month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(Math.random() * 500) + 500}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          idx === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {100}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          idx === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {Math.floor(Math.random() * 15) + 65}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          idx === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {Math.floor(Math.random() * 15) + 45}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          idx === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {Math.floor(Math.random() * 15) + 30}%
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-100">
            <h3 className="font-medium text-blue-800 mb-2">
              User Growth Trend
            </h3>
            <p className="text-blue-700">
              User growth has increased by 24% compared to the previous period.
              The most significant growth is observed in the mobile user
              segment.
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-green-50 border-green-100">
            <h3 className="font-medium text-green-800 mb-2">
              Engagement Patterns
            </h3>
            <p className="text-green-700">
              Average session duration has improved by 17%. Users spend the most
              time browsing Fruits & Vegetables and Dairy & Eggs categories.
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-purple-50 border-purple-100">
            <h3 className="font-medium text-purple-800 mb-2">
              Retention Opportunities
            </h3>
            <p className="text-purple-700">
              User retention drops significantly after week 2. Consider
              implementing targeted engagement strategies for this time period.
            </p>
          </div>
          <div className="border rounded-lg p-4 bg-orange-50 border-orange-100">
            <h3 className="font-medium text-orange-800 mb-2">
              Peak Usage Times
            </h3>
            <p className="text-orange-700">
              Platform usage peaks between 6 PM - 8 PM. Consider scheduling
              promotions and new product launches during these high-traffic
              hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEngagementMetrics;
