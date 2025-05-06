import React, { useState } from "react";
import { 
  ArrowUp, 
  ArrowDown, 
  ShoppingCart, 
  Store, 
  Users, 
  Truck 
} from "lucide-react";

const PerformanceCard = ({ title, value, change, icon, isPositive }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5">
    <div className="flex justify-between items-center mb-3">
      <p className="text-gray-500 text-sm">{title}</p>
      <div className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1 text-xs">{change}</span>
      </div>
    </div>
    <p className="text-xl font-bold">{value}</p>
    <div className="mt-4 flex justify-end">
      {icon}
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
      active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const Performance = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState("week");

  // Dummy data
  const performanceMetrics = [
    {
      title: "Total Orders",
      value: "1,284",
      change: "12.5%",
      icon: <ShoppingCart className="text-blue-500" size={24} />,
      isPositive: true,
    },
    {
      title: "Active Stores",
      value: "42",
      change: "5.2%",
      icon: <Store className="text-purple-500" size={24} />,
      isPositive: true,
    },
    {
      title: "New Customers",
      value: "183",
      change: "3.1%",
      icon: <Users className="text-indigo-500" size={24} />,
      isPositive: true,
    },
    {
      title: "Delivery Time",
      value: "32 min",
      change: "8.4%",
      icon: <Truck className="text-orange-500" size={24} />,
      isPositive: false,
    },
  ];

  const topStores = [
    { id: 1, name: "Fresh Mart", orders: 284, revenue: "$12,840", rating: 4.8 },
    { id: 2, name: "Quick Grocery", orders: 198, revenue: "$9,560", rating: 4.7 },
    { id: 3, name: "Neighborhood Market", orders: 176, revenue: "$8,320", rating: 4.6 },
    { id: 4, name: "Daily Needs", orders: 152, revenue: "$7,120", rating: 4.5 },
    { id: 5, name: "City Supermarket", orders: 134, revenue: "$6,480", rating: 4.4 },
  ];

  const orderStatusData = [
    { status: "Completed", count: 984, percentage: 76.6, color: "bg-green-500" },
    { status: "In Progress", count: 184, percentage: 14.3, color: "bg-blue-500" },
    { status: "Cancelled", count: 68, percentage: 5.3, color: "bg-red-500" },
    { status: "Returned", count: 48, percentage: 3.8, color: "bg-orange-500" },
  ];

  const tabs = ["Overview", "Stores", "Orders", "Customers", "Delivery"];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0">Platform Performance</h1>
        <div className="w-full sm:w-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Last 24h</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
          </select>
        </div>
      </div>

      <div className="flex overflow-x-auto mb-6 pb-1 scrollbar-hide">
        <div className="flex space-x-2">
          {tabs.map((tab, index) => (
            <TabButton 
              key={index}
              active={activeTab === index}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </TabButton>
          ))}
        </div>
      </div>

      {activeTab === 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {performanceMetrics.map((metric, index) => (
              <PerformanceCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-bold mb-4">Top Performing Stores</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Store</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Orders</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Revenue</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topStores.map((store) => (
                      <tr key={store.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">{store.name}</td>
                        <td className="py-3 px-2 text-right">{store.orders}</td>
                        <td className="py-3 px-2 text-right">{store.revenue}</td>
                        <td className="py-3 px-2 text-right">{store.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5">
              <h2 className="text-lg font-bold mb-4">Order Status Breakdown</h2>
              <div className="space-y-4">
                {orderStatusData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.status}</span>
                      <span className="text-sm">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 1 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-bold mb-4">Store Performance Analytics</h2>
          <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Store performance charts will be displayed here</p>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-bold mb-4">Order Analytics</h2>
          <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Order analytics charts will be displayed here</p>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-bold mb-4">Customer Insights</h2>
          <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Customer analytics charts will be displayed here</p>
          </div>
        </div>
      )}

      {activeTab === 4 && (
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-bold mb-4">Delivery Performance</h2>
          <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Delivery performance charts will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;