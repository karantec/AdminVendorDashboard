import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import _ from "lodash";

// Dummy data generator
const generateDummyData = () => {
  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Beverages",
    "Snacks",
    "Meat",
  ];
  const stores = [
    { id: "store1", name: "FreshMart" },
    { id: "store2", name: "Green Grocers" },
    { id: "store3", name: "City Supermarket" },
    { id: "store4", name: "Express Grocery" },
  ];

  const paymentMethods = ["card", "cash", "wallet"];
  const statuses = ["completed", "cancelled", "refunded"];

  const result = [];

  // Generate 200 random sales entries spanning the last 90 days
  for (let i = 0; i < 200; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

    const store = stores[Math.floor(Math.random() * stores.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    result.push({
      id: `order-${i + 1000}`,
      date: randomDate.toISOString().split("T")[0],
      storeId: store.id,
      storeName: store.name,
      totalAmount: Math.floor(Math.random() * 10000) / 100 + 5, // Between $5 and $105
      items: Math.floor(Math.random() * 10) + 1, // Between 1 and 10 items
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      status:
        Math.random() < 0.85
          ? "completed"
          : Math.random() < 0.5
          ? "cancelled"
          : "refunded", // 85% completed
      customerName: `Customer ${Math.floor(Math.random() * 100) + 1}`,
      category,
    });
  }

  // Sort by date, newest first
  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Main Component
const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days by default
    endDate: new Date(),
  });
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [chartType, setChartType] = useState("line");
  const [groupBy, setGroupBy] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Load data
  useEffect(() => {
    // Simulating API call
    setLoading(true);

    setTimeout(() => {
      const data = generateDummyData();
      setSalesData(data);

      // Extract unique stores
      const uniqueStores = _.uniqBy(
        data.map((item) => ({
          id: item.storeId,
          name: item.storeName,
        })),
        "id"
      );

      setStores(uniqueStores);
      setLoading(false);
    }, 800);
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    if (salesData.length === 0) return;

    let filtered = [...salesData];

    // Date range filter
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
    });

    // Store filter
    if (selectedStore !== "all") {
      filtered = filtered.filter((item) => item.storeId === selectedStore);
    }

    // Payment method filter
    if (selectedPaymentMethod !== "all") {
      filtered = filtered.filter(
        (item) => item.paymentMethod === selectedPaymentMethod
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    salesData,
    dateRange,
    selectedStore,
    selectedPaymentMethod,
    selectedStatus,
  ]);

  // Calculate metrics
  const calculateMetrics = () => {
    if (filteredData.length === 0) {
      return {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        refundedOrders: 0,
      };
    }

    const totalSales = _.sumBy(
      filteredData.filter((item) => item.status === "completed"),
      "totalAmount"
    );
    const totalOrders = filteredData.length;
    const averageOrderValue =
      totalSales /
        filteredData.filter((item) => item.status === "completed").length || 0;
    const completedOrders = filteredData.filter(
      (item) => item.status === "completed"
    ).length;
    const cancelledOrders = filteredData.filter(
      (item) => item.status === "cancelled"
    ).length;
    const refundedOrders = filteredData.filter(
      (item) => item.status === "refunded"
    ).length;

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      completedOrders,
      cancelledOrders,
      refundedOrders,
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (filteredData.length === 0) return [];

    // Group data by selected timeframe
    let groupedData;

    if (groupBy === "day") {
      groupedData = _.groupBy(filteredData, "date");

      return Object.entries(groupedData)
        .map(([date, entries]) => ({
          name: date,
          sales: _.sumBy(
            entries.filter((e) => e.status === "completed"),
            "totalAmount"
          ),
          orders: entries.length,
          cancelled: entries.filter((e) => e.status === "cancelled").length,
          refunded: entries.filter((e) => e.status === "refunded").length,
        }))
        .sort(
          (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
        );
    } else if (groupBy === "week") {
      // Group by week
      const weekData = filteredData.reduce((acc, curr) => {
        const date = new Date(curr.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split("T")[0];

        if (!acc[weekKey]) {
          acc[weekKey] = [];
        }

        acc[weekKey].push(curr);
        return acc;
      }, {});

      return Object.entries(weekData)
        .map(([weekStart, entries]) => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);

          return {
            name: `${weekStart} - ${weekEnd.toISOString().split("T")[0]}`,
            sales: _.sumBy(
              entries.filter((e) => e.status === "completed"),
              "totalAmount"
            ),
            orders: entries.length,
            cancelled: entries.filter((e) => e.status === "cancelled").length,
            refunded: entries.filter((e) => e.status === "refunded").length,
          };
        })
        .sort((a, b) => {
          return (
            new Date(a.name.split(" - ")[0]).getTime() -
            new Date(b.name.split(" - ")[0]).getTime()
          );
        });
    } else if (groupBy === "month") {
      // Group by month
      const monthData = filteredData.reduce((acc, curr) => {
        const yearMonth = curr.date.substring(0, 7); // YYYY-MM format

        if (!acc[yearMonth]) {
          acc[yearMonth] = [];
        }

        acc[yearMonth].push(curr);
        return acc;
      }, {});

      return Object.entries(monthData)
        .map(([yearMonth, entries]) => ({
          name: yearMonth,
          sales: _.sumBy(
            entries.filter((e) => e.status === "completed"),
            "totalAmount"
          ),
          orders: entries.length,
          cancelled: entries.filter((e) => e.status === "cancelled").length,
          refunded: entries.filter((e) => e.status === "refunded").length,
        }))
        .sort((a, b) => {
          return new Date(a.name).getTime() - new Date(b.name).getTime();
        });
    }

    return [];
  };

  // Prepare pie chart data
  const preparePieData = () => {
    if (filteredData.length === 0) return [];

    // For payment methods
    if (chartType === "pie") {
      const paymentMethodCounts = _.countBy(filteredData, "paymentMethod");

      return Object.entries(paymentMethodCounts).map(([method, count]) => ({
        name: method.charAt(0).toUpperCase() + method.slice(1),
        value: count,
      }));
    }

    return [];
  };

  // Category-wise sales data
  const prepareCategoryData = () => {
    if (filteredData.length === 0) return [];

    const categoryGroups = _.groupBy(
      filteredData.filter((item) => item.status === "completed"),
      "category"
    );

    return Object.entries(categoryGroups)
      .map(([category, items]) => ({
        name: category,
        value: _.sumBy(items, "totalAmount"),
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Store-wise sales data
  const prepareStoreData = () => {
    if (filteredData.length === 0) return [];

    const storeGroups = _.groupBy(
      filteredData.filter((item) => item.status === "completed"),
      "storeId"
    );

    return Object.entries(storeGroups)
      .map(([storeId, items]) => ({
        name: items[0].storeName,
        value: _.sumBy(items, "totalAmount"),
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Date handlers
  const handleStartDateChange = (e) => {
    setDateRange({
      ...dateRange,
      startDate: new Date(e.target.value),
    });
  };

  const handleEndDateChange = (e) => {
    setDateRange({
      ...dateRange,
      endDate: new Date(e.target.value),
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = [
      "Order ID",
      "Date",
      "Store",
      "Customer",
      "Amount",
      "Items",
      "Payment Method",
      "Status",
      "Category",
    ].join(",");

    const csvContent = filteredData
      .map((item) => {
        return [
          item.id,
          item.date,
          item.storeName,
          item.customerName,
          item.totalAmount,
          item.items,
          item.paymentMethod,
          item.status,
          item.category,
        ].join(",");
      })
      .join("\n");

    const csv = `${headers}\n${csvContent}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `minutos-sales-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics for display
  const metrics = calculateMetrics();
  const chartData = prepareChartData();
  const pieData = preparePieData();
  const categoryData = prepareCategoryData();
  const storeData = prepareStoreData();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
        <p className="text-gray-600">
          Analyze your sales performance across all stores
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={dateRange.startDate.toISOString().split("T")[0]}
              onChange={handleStartDateChange}
              max={dateRange.endDate.toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={dateRange.endDate.toISOString().split("T")[0]}
              onChange={handleEndDateChange}
              min={dateRange.startDate.toISOString().split("T")[0]}
            />
          </div>

          {/* Store filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              <option value="all">All Stores</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment method filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          {/* Order status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Status
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.totalSales)}
          </p>
          <div className="mt-1 text-xs text-gray-500">
            {metrics.totalOrders} orders
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(metrics.averageOrderValue)}
          </p>
          <div className="mt-1 text-xs text-gray-500">Per completed order</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Completed Orders
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {metrics.completedOrders}
          </p>
          <div className="mt-1 text-xs text-gray-500">
            {metrics.totalOrders > 0
              ? `${Math.round(
                  (metrics.completedOrders / metrics.totalOrders) * 100
                )}% of total`
              : "0% of total"}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-sm font-medium text-gray-500">
            Cancelled/Refunded
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {metrics.cancelledOrders + metrics.refundedOrders}
          </p>
          <div className="mt-1 text-xs text-gray-500">
            {metrics.totalOrders > 0
              ? `${Math.round(
                  ((metrics.cancelledOrders + metrics.refundedOrders) /
                    metrics.totalOrders) *
                    100
                )}% of total`
              : "0% of total"}
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sales Trend</h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <div>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div>
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                disabled={chartType === "pie"}
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
            </div>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={exportToCSV}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={groupBy === "day" ? 6 : groupBy === "week" ? 1 : 0}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0088FE"
                  name="Sales Amount"
                  strokeWidth={2}
                />
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={groupBy === "day" ? 6 : groupBy === "week" ? 1 : 0}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="sales" fill="#0088FE" name="Sales Amount" />
                <Bar dataKey="orders" fill="#00C49F" name="Number of Orders" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category & Store Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Category breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#8884d8" name="Sales Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Store</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={storeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {storeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Order Details</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              className="p-1 border border-gray-300 rounded-md"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.id}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.storeName}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.items}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        ${
                          order.paymentMethod === "card"
                            ? "bg-blue-100 text-blue-800"
                            : order.paymentMethod === "cash"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {order.paymentMethod.charAt(0).toUpperCase() +
                          order.paymentMethod.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    No orders found with the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {filteredData.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No data available
          </h3>
          <p className="mt-1 text-gray-500">
            No sales data matches your current filter criteria. Try changing
            your filters or date range.
          </p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              setDateRange({
                startDate: new Date(
                  new Date().setDate(new Date().getDate() - 30)
                ),
                endDate: new Date(),
              });
              setSelectedStore("all");
              setSelectedPaymentMethod("all");
              setSelectedStatus("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
