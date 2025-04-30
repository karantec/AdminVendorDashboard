import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
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
  Cell
} from 'recharts';
import { RefreshCw, Server, Users, ShoppingBag, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

// Types
interface SystemMetric {
  id: string;
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface CPUMetric {
  time: string;
  usage: number;
}

interface MemoryMetric {
  time: string;
  usage: number;
}

interface ResponseTimeMetric {
  time: string;
  apiResponseTime: number;
  databaseResponseTime: number;
}

interface ErrorRate {
  time: string;
  rate: number;
}

interface RequestsData {
  time: string;
  count: number;
}

interface TrafficSource {
  source: string;
  value: number;
}

interface ServerStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  load: number;
}

interface TimeRange {
  value: string;
  label: string;
}

const SystemPerformance: React.FC = () => {
  // State management
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('24h');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Time range options
  const timeRangeOptions: TimeRange[] = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  // Generate dummy data for CPU metrics
  const generateCPUData = (): CPUMetric[] => {
    const data: CPUMetric[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: `${time.getHours()}:00`,
        usage: Math.floor(Math.random() * 30) + 40, // Random between 40-70%
      });
    }
    
    return data;
  };
  
  // Generate dummy data for memory metrics
  const generateMemoryData = (): MemoryMetric[] => {
    const data: MemoryMetric[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: `${time.getHours()}:00`,
        usage: Math.floor(Math.random() * 25) + 50, // Random between 50-75%
      });
    }
    
    return data;
  };
  
  // Generate dummy data for response time
  const generateResponseTimeData = (): ResponseTimeMetric[] => {
    const data: ResponseTimeMetric[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: `${time.getHours()}:00`,
        apiResponseTime: Math.floor(Math.random() * 150) + 50, // 50-200ms
        databaseResponseTime: Math.floor(Math.random() * 100) + 30, // 30-130ms
      });
    }
    
    return data;
  };
  
  // Generate dummy data for error rates
  const generateErrorRateData = (): ErrorRate[] => {
    const data: ErrorRate[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: `${time.getHours()}:00`,
        rate: Math.random() * 2, // 0-2%
      });
    }
    
    return data;
  };
  
  // Generate dummy data for request counts
  const generateRequestsData = (): RequestsData[] => {
    const data: RequestsData[] = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(now.getHours() - i);
      
      data.push({
        time: `${time.getHours()}:00`,
        count: Math.floor(Math.random() * 1000) + 500, // 500-1500 requests
      });
    }
    
    return data;
  };
  
  // Generate dummy data for traffic sources
  const generateTrafficSourceData = (): TrafficSource[] => {
    return [
      { source: 'Web App', value: 45 },
      { source: 'Mobile App', value: 40 },
      { source: 'API Clients', value: 10 },
      { source: 'Admin Portal', value: 5 }
    ];
  };
  
  // Generate dummy server status data
  const generateServerStatusData = (): ServerStatus[] => {
    return [
      { 
        id: 's1', 
        name: 'API Server', 
        status: 'online', 
        uptime: '15d 7h 32m', 
        load: 65 
      },
      { 
        id: 's2', 
        name: 'Database Server', 
        status: 'online', 
        uptime: '23d 14h 11m', 
        load: 72 
      },
      { 
        id: 's3', 
        name: 'Cache Server', 
        status: 'online', 
        uptime: '7d 22h 45m', 
        load: 48 
      },
      { 
        id: 's4', 
        name: 'Backup Server', 
        status: 'maintenance', 
        uptime: '0d 5h 12m', 
        load: 10 
      }
    ];
  };
  
  // Dummy metrics
  const generateKeyMetrics = (): SystemMetric[] => {
    return [
      {
        id: 'active-users',
        title: 'Active Users',
        value: '2,847',
        trend: 'up',
        change: '+12%',
        icon: <Users size={18} />,
        color: 'text-blue-500'
      },
      {
        id: 'response-time',
        title: 'Avg. Response Time',
        value: '128ms',
        trend: 'down',
        change: '-8%',
        icon: <Clock size={18} />,
        color: 'text-green-500'
      },
      {
        id: 'error-rate',
        title: 'Error Rate',
        value: '0.8%',
        trend: 'down',
        change: '-0.2%',
        icon: <AlertTriangle size={18} />,
        color: 'text-green-500'
      },
      {
        id: 'orders',
        title: 'Orders Today',
        value: '935',
        trend: 'up',
        change: '+5%',
        icon: <ShoppingBag size={18} />,
        color: 'text-blue-500'
      }
    ];
  };
  
  // Initialize state with dummy data
  const [cpuData, setCpuData] = useState<CPUMetric[]>(generateCPUData());
  const [memoryData, setMemoryData] = useState<MemoryMetric[]>(generateMemoryData());
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeMetric[]>(generateResponseTimeData());
  const [errorRateData, setErrorRateData] = useState<ErrorRate[]>(generateErrorRateData());
  const [requestsData, setRequestsData] = useState<RequestsData[]>(generateRequestsData());
  const [trafficSourceData, setTrafficSourceData] = useState<TrafficSource[]>(generateTrafficSourceData());
  const [serverStatusData, setServerStatusData] = useState<ServerStatus[]>(generateServerStatusData());
  const [keyMetrics, setKeyMetrics] = useState<SystemMetric[]>(generateKeyMetrics());
  
  // Mock refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setCpuData(generateCPUData());
      setMemoryData(generateMemoryData());
      setResponseTimeData(generateResponseTimeData());
      setErrorRateData(generateErrorRateData());
      setRequestsData(generateRequestsData());
      setTrafficSourceData(generateTrafficSourceData());
      setServerStatusData(generateServerStatusData());
      setKeyMetrics(generateKeyMetrics());
      
      setRefreshing(false);
    }, 1000);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    handleRefresh();
  };
  
  useEffect(() => {
    // Initial data load
    handleRefresh();
    
    // Set up polling interval (every 5 minutes)
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="p-6 max-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">System Performance</h1>
          <p className="text-gray-500">Monitor your system's health and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <select
              value={selectedTimeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('servers')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'servers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Servers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'errors'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Errors
            </button>
          </nav>
        </div>
        
        {activeTab === 'overview' && (
          <div className="p-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {keyMetrics.map((metric) => (
                <div key={metric.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-md ${metric.color.replace('text', 'bg')} bg-opacity-20`}>
                        {metric.icon}
                      </div>
                      <h3 className="ml-3 text-sm font-medium text-gray-500">{metric.title}</h3>
                    </div>
                    <span 
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        metric.trend === 'up' && metric.id !== 'error-rate' 
                          ? 'bg-green-100 text-green-800' 
                          : metric.trend === 'down' && metric.id === 'error-rate'
                          ? 'bg-green-100 text-green-800'
                          : metric.trend === 'down' && metric.id !== 'error-rate'
                          ? 'bg-red-100 text-red-800'
                          : metric.trend === 'up' && metric.id === 'error-rate'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {metric.change}
                    </span>
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
            
            {/* CPU & Memory Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">CPU Usage</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cpuData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="usage" 
                        name="CPU Usage (%)" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Memory Usage</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={memoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="usage" 
                        name="Memory Usage (%)" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Response Time & Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Response Time</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="apiResponseTime" 
                        name="API Response (ms)" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="databaseResponseTime" 
                        name="DB Response (ms)" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Traffic Sources</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="source"
                        label={({ source, value }) => `${source}: ${value}%`}
                      >
                        {trafficSourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'servers' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Server Status</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Server
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uptime
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Load
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serverStatusData.map((server) => (
                      <tr key={server.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                              <Server size={20} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{server.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            server.status === 'online'
                              ? 'bg-green-100 text-green-800'
                              : server.status === 'offline'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {server.uptime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  server.load > 80
                                    ? 'bg-red-500'
                                    : server.load > 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${server.load}%` }}
                              ></div>
                            </div>
                            <span className="ml-2">{server.load}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">CPU Usage by Server</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'API Server', usage: 65 },
                        { name: 'Database Server', usage: 72 },
                        { name: 'Cache Server', usage: 48 },
                        { name: 'Backup Server', usage: 10 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" name="CPU Usage (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Memory Usage by Server</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'API Server', usage: 58 },
                        { name: 'Database Server', usage: 87 },
                        { name: 'Cache Server', usage: 70 },
                        { name: 'Backup Server', usage: 15 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" name="Memory Usage (%)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Request Volume</h3>
              </div>
              <div className="p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={requestsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Request Count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Request Types</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'GET', value: 65 },
                          { name: 'POST', value: 25 },
                          { name: 'PUT', value: 7 },
                          { name: 'DELETE', value: 3 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {[
                          { name: 'GET', value: 65 },
                          { name: 'POST', value: 25 },
                          { name: 'PUT', value: 7 },
                          { name: 'DELETE', value: 3 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Top Endpoints</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { endpoint: '/api/orders', count: 430 },
                        { endpoint: '/api/products', count: 287 },
                        { endpoint: '/api/users', count: 176 },
                        { endpoint: '/api/stores', count: 124 },
                        { endpoint: '/api/cart', count: 103 }
                      ]}
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="endpoint" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Request Count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'errors' && (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium">Error Rate Over Time</h3>
              </div>
              <div className="p-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 'dataMax + 0.5']} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="Error Rate (%)" 
                      stroke="#ff7300" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Error Types</h3>
                </div>
                <div className="p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '500 Internal Server', value: 42 },
                          { name: '404 Not Found', value: 28 },
                          { name: '403 Forbidden', value: 15 },
                          { name: '429 Too Many Requests', value: 10 },
                          { name: 'Other', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {[
                          { name: '500 Internal Server', value: 42 },
                          { name: '404 Not Found', value: 28 },
                          { name: '403 Forbidden', value: 15 },
                          { name: '429 Too Many Requests', value: 10 },
                          { name: 'Other', value: 5 }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Recent Errors</h3>
                </div>
                <div className="p-4 max-h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Endpoint
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 'e1', time: '14:32:45', error: '500 Internal Server Error', endpoint: '/api/orders/process' },
                        { id: 'e2', time: '14:20:18', error: '404 Not Found', endpoint: '/api/products/123456' },
                        { id: 'e3', time: '13:55:09', error: '403 Forbidden', endpoint: '/api/admin/settings' },
                        { id: 'e4', time: '13:48:27', error: '429 Too Many Requests', endpoint: '/api/search' },
                        { id: 'e5', time: '13:42:11', error: '500 Internal Server Error', endpoint: '/api/checkout/payment' },
                        { id: 'e6', time: '13:30:54', error: '404 Not Found', endpoint: '/api/categories/electronics' },
                        { id: 'e7', time: '13:15:22', error: '500 Internal Server Error', endpoint: '/api/user/profile' }
                      ].map((error) => (
                        <tr key={error.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {error.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              error.error.startsWith('500')
                                ? 'bg-red-100 text-red-800'
                                : error.error.startsWith('404')
                                ? 'bg-yellow-100 text-yellow-800'
                                : error.error.startsWith('403')
                                ? 'bg-orange-100 text-orange-800'
                                : error.error.startsWith('429')
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {error.error}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {error.endpoint}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* System Health Score */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">System Health Score</h2>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-500">Healthy</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3">
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" 
                style={{ width: '92%' }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">50</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
          </div>
          
          <div className="col-span-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl font-bold text-green-500">92</p>
              <p className="text-sm text-gray-500">out of 100</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Performance</p>
              <p className="font-medium">90/100</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Reliability</p>
              <p className="font-medium">95/100</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Security</p>
              <p className="font-medium">88/100</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-medium">94/100</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">System Recommendations</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Consider scaling database resources
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Database server memory usage is consistently above 80% during peak hours. Consider upgrading memory or optimizing queries.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button type="button" className="px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      View Details
                    </button>
                    <button type="button" className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                      Optimize Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-blue-300 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  API performance can be improved
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Adding Redis caching for frequent product queries could reduce API response time by up to 30% based on current usage patterns.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button type="button" className="px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      View Analysis
                    </button>
                    <button type="button" className="ml-3 px-2 py-1.5 rounded-md text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Implement
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-green-300 bg-green-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Server className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Backup server maintenance completed
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Scheduled maintenance of the backup server was completed successfully. All backups are now running on the latest software version.</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button type="button" className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPerformance;