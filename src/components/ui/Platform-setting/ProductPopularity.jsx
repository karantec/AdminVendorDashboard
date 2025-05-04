import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Filter, Download } from "lucide-react";

// Dummy data for product popularity
const dummyProducts = [
  {
    id: "1",
    name: "Fresh Milk",
    category: "Dairy",
    totalOrders: 1245,
    revenue: 4980,
  },
  {
    id: "2",
    name: "Whole Wheat Bread",
    category: "Bakery",
    totalOrders: 1120,
    revenue: 3360,
  },
  {
    id: "3",
    name: "Chicken Breast",
    category: "Meat",
    totalOrders: 980,
    revenue: 7840,
  },
  {
    id: "4",
    name: "Organic Bananas",
    category: "Produce",
    totalOrders: 850,
    revenue: 2550,
  },
  {
    id: "5",
    name: "Eggs (Dozen)",
    category: "Dairy",
    totalOrders: 820,
    revenue: 4100,
  },
  {
    id: "6",
    name: "Greek Yogurt",
    category: "Dairy",
    totalOrders: 780,
    revenue: 3120,
  },
  {
    id: "7",
    name: "Tomatoes",
    category: "Produce",
    totalOrders: 720,
    revenue: 2160,
  },
  {
    id: "8",
    name: "Potato Chips",
    category: "Snacks",
    totalOrders: 690,
    revenue: 2070,
  },
  {
    id: "9",
    name: "Ground Coffee",
    category: "Beverages",
    totalOrders: 650,
    revenue: 5200,
  },
  {
    id: "10",
    name: "Pasta",
    category: "Pantry",
    totalOrders: 630,
    revenue: 1890,
  },
];

// Dummy data for category distribution
const dummyCategoryData = [
  { name: "Dairy", value: 2845 },
  { name: "Bakery", value: 1120 },
  { name: "Meat", value: 980 },
  { name: "Produce", value: 1570 },
  { name: "Snacks", value: 690 },
  { name: "Beverages", value: 650 },
  { name: "Pantry", value: 630 },
];

// Dummy data for time series
const generateTimeSeriesData = (days) => {
  const data = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Generate random orders between 50-200
    const orders = Math.floor(Math.random() * 150) + 50;

    data.push({
      date: date.toISOString().split("T")[0],
      orders,
    });
  }

  return data;
};

// Colors for pie chart
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FF6B6B",
];

const ProductPopularity = () => {
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [filters, setFilters] = useState({
    timeRange: "month",
    category: null,
    minOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState([]);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);

    // In a real application, this would be an API call
    setTimeout(() => {
      setProducts(dummyProducts);
      setCategoryData(dummyCategoryData);

      // Generate appropriate time series data based on selected time range
      let days = 30;
      if (filters.timeRange === "day") days = 1;
      if (filters.timeRange === "week") days = 7;
      if (filters.timeRange === "year") days = 365;

      setTimeSeriesData(generateTimeSeriesData(days));

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(dummyProducts.map((p) => p.category))
      );
      setCategories(uniqueCategories);

      setIsLoading(false);
    }, 800);
  }, [filters.timeRange]);

  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (product.totalOrders < filters.minOrders) return false;
    return true;
  });

  // Handle filter changes
  const handleTimeRangeChange = (range) => {
    setFilters((prev) => ({ ...prev, timeRange: range }));
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value === "all" ? null : event.target.value;
    setFilters((prev) => ({ ...prev, category }));
  };

  const handleMinOrdersChange = (event) => {
    const minOrders = parseInt(event.target.value) || 0;
    setFilters((prev) => ({ ...prev, minOrders }));
  };

  // Export data function
  const exportData = () => {
    const dataToExport = JSON.stringify(filteredProducts, null, 2);
    const blob = new Blob([dataToExport], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "product_popularity_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Product Popularity Analytics
        </h1>
        <p className="text-gray-600">
          Track your best-selling products and analyze trends
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <h2 className="font-semibold">Filters</h2>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Time Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <select
                className="border rounded-md px-3 py-1 bg-gray-50"
                value={filters.timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="border rounded-md px-3 py-1 bg-gray-50"
                value={filters.category || "all"}
                onChange={handleCategoryChange}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Orders Filter */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min. Orders"
                value={filters.minOrders || ""}
                onChange={handleMinOrdersChange}
                className="border rounded-md px-3 py-1 bg-gray-50 w-24"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center gap-1"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6 border-b">
        <div className="flex gap-6">
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === "products"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Top Products
          </button>
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === "categories"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Category Distribution
          </button>
          <button
            className={`py-2 px-1 font-medium ${
              activeTab === "trends"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("trends")}
          >
            Order Trends
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Top Products View */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-6">
                  Most Popular Products
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredProducts.slice(0, 10)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `${value} orders`,
                          "Total Orders",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="totalOrders"
                        name="Total Orders"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4">Products Details</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.totalOrders.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    No products match your filter criteria.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Category Distribution View */}
          {activeTab === "categories" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-6">
                  Category Distribution
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          `${value} orders`,
                          "Total Orders",
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-6">
                  Orders by Category
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip
                        formatter={(value) => [
                          `${value} orders`,
                          "Total Orders",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Total Orders" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Category Details</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % of Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryData.map((category) => {
                      const totalOrders = categoryData.reduce(
                        (sum, cat) => sum + cat.value,
                        0
                      );
                      const percentage = (
                        (category.value / totalOrders) *
                        100
                      ).toFixed(1);

                      return (
                        <tr key={category.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.value.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Trends View */}
          {activeTab === "trends" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-6">
                  Order Trends{" "}
                  {filters.timeRange === "day"
                    ? "Today"
                    : filters.timeRange === "week"
                    ? "This Week"
                    : filters.timeRange === "month"
                    ? "This Month"
                    : "This Year"}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeSeriesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} orders`, "Orders"]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-base font-medium text-gray-500">
                    Total Orders
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {timeSeriesData
                      .reduce((sum, data) => sum + data.orders, 0)
                      .toLocaleString()}
                  </p>
                  <div className="mt-2 text-sm text-green-600">
                    +12.5% from previous period
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-base font-medium text-gray-500">
                    Average Daily Orders
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {Math.round(
                      timeSeriesData.reduce(
                        (sum, data) => sum + data.orders,
                        0
                      ) / timeSeriesData.length
                    ).toLocaleString()}
                  </p>
                  <div className="mt-2 text-sm text-green-600">
                    +8.2% from previous period
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-base font-medium text-gray-500">
                    Peak Day
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {
                      timeSeriesData.reduce(
                        (max, data) => (data.orders > max.orders ? data : max),
                        { date: "", orders: 0 }
                      ).date
                    }
                  </p>
                  <div className="mt-2 text-sm text-gray-600">
                    {timeSeriesData
                      .reduce(
                        (max, data) => (data.orders > max.orders ? data : max),
                        { date: "", orders: 0 }
                      )
                      .orders.toLocaleString()}{" "}
                    orders
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPopularity;
