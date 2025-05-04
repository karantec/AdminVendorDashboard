import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, subDays } from "date-fns";

// Import icons
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DevicesIcon from "@mui/icons-material/Devices";
import PublicIcon from "@mui/icons-material/Public";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";

// Dummy data generator functions
const generateUsers = (count) => {
  const roles = ["admin", "user", "moderator"];
  const statuses = ["active", "inactive", "suspended"];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastLogin: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ),
    signupDate: new Date(
      Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
    ),
    role: roles[Math.floor(Math.random() * roles.length)],
  }));
};

const generateActivityData = (days) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    return {
      date,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      newUsers: Math.floor(Math.random() * 20) + 5,
      returningUsers: Math.floor(Math.random() * 80) + 30,
    };
  });
};

const deviceData = [
  { device: "Mobile", count: 65 },
  { device: "Desktop", count: 25 },
  { device: "Tablet", count: 10 },
];

const locationData = [
  { country: "United States", users: 45, code: "US" },
  { country: "United Kingdom", users: 30, code: "GB" },
  { country: "Canada", users: 15, code: "CA" },
  { country: "Australia", users: 10, code: "AU" },
  { country: "Germany", users: 8, code: "DE" },
  { country: "France", users: 7, code: "FR" },
];

// Chart colors
const CHART_COLORS = {
  primary: "#6366F1",
  secondary: "#10B981",
  tertiary: "#F59E0B",
  quaternary: "#EC4899",
  accent: "#8B5CF6",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  info: "#3B82F6",
  muted: "#94A3B8",
};

// Status colors
const STATUS_COLORS = {
  active: CHART_COLORS.success,
  inactive: CHART_COLORS.warning,
  suspended: CHART_COLORS.error,
};

// Role colors
const ROLE_COLORS = {
  admin: CHART_COLORS.primary,
  moderator: CHART_COLORS.accent,
  user: CHART_COLORS.muted,
};

// Custom card component
const StatsCard = ({
  title,
  value,
  icon,
  trend,
  color = CHART_COLORS.primary,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <Box
            sx={{
              bgcolor: alpha(color, 0.1),
              color: color,
              borderRadius: "50%",
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography color="textSecondary" variant="body2" fontWeight={500}>
            {title}
          </Typography>
        </Box>

        {isLoading ? (
          <LinearProgress sx={{ mt: 2, mb: 2 }} />
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: trend ? 0.5 : 0,
              color: theme.palette.text.primary,
            }}
          >
            {value}
          </Typography>
        )}

        {trend && (
          <Box display="flex" alignItems="center" mt={0.5}>
            <Typography
              variant="body2"
              sx={{
                color: trend.positive
                  ? CHART_COLORS.success
                  : CHART_COLORS.error,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              vs. previous period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Chart Card Component
const ChartCard = ({ title, children, height = 350, action }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight={600} color="textPrimary">
            {title}
          </Typography>
          {action}
        </Box>
        <Box sx={{ height }}>{children}</Box>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 2,
          borderRadius: 1,
          boxShadow: 2,
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="body2" color="textSecondary" mb={1}>
          {label instanceof Date
            ? format(new Date(label), "MMM dd, yyyy")
            : label}
        </Typography>
        {payload.map((entry, index) => (
          <Box
            key={`item-${index}`}
            display="flex"
            alignItems="center"
            mb={0.5}
          >
            <Box
              component="span"
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: entry.color,
                mr: 1,
                display: "inline-block",
              }}
            />
            <Typography variant="body2" color="textPrimary">
              {entry.name}: {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

// Empty state component
const EmptyState = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        py: 5,
      }}
    >
      <Box
        component="img"
        src="/api/placeholder/400/200"
        alt="No data"
        sx={{ width: 150, height: 150, opacity: 0.6, mb: 2 }}
      />
      <Typography color="textSecondary" variant="body1">
        {message}
      </Typography>
    </Box>
  );
};

// Custom date formatter
const formatDate = (date) => format(date, "MMM dd, yyyy");

// Main component
const UserAnalyticsPage = () => {
  const theme = useTheme();

  // State
  const [timeRange, setTimeRange] = useState("7days");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  // Load initial data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(generateUsers(50));
      setActivityData(generateActivityData(30));
      setLoading(false);
    }, 1000);
  }, [refreshKey]);

  // Update activity data when time range changes
  useEffect(() => {
    if (timeRange === "custom" && startDate && endDate) {
      const days =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      setActivityData(generateActivityData(days));
    } else {
      const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
      setActivityData(generateActivityData(days));
    }
  }, [timeRange, startDate, endDate]);

  // Filter users based on search term and date range
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchTerm ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase());

    const withinDateRange =
      !startDate ||
      !endDate ||
      (user.signupDate >= startDate && user.signupDate <= endDate);

    return matchesSearch && withinDateRange;
  });

  // Calculate statistics
  const activeUsersCount = users.filter(
    (user) => user.status === "active"
  ).length;
  const inactiveUsersCount = users.filter(
    (user) => user.status === "inactive"
  ).length;
  const suspendedUsersCount = users.filter(
    (user) => user.status === "suspended"
  ).length;
  const totalNewUsers = activityData.reduce(
    (sum, day) => sum + day.newUsers,
    0
  );
  const avgDailyActive = Math.round(
    activityData.reduce((sum, day) => sum + day.activeUsers, 0) /
      activityData.length
  );

  // Chart data
  const statusData = [
    { name: "Active", value: activeUsersCount, color: STATUS_COLORS.active },
    {
      name: "Inactive",
      value: inactiveUsersCount,
      color: STATUS_COLORS.inactive,
    },
    {
      name: "Suspended",
      value: suspendedUsersCount,
      color: STATUS_COLORS.suspended,
    },
  ];

  const roleData = [
    {
      name: "Admin",
      value: users.filter((user) => user.role === "admin").length,
      color: ROLE_COLORS.admin,
    },
    {
      name: "User",
      value: users.filter((user) => user.role === "user").length,
      color: ROLE_COLORS.user,
    },
    {
      name: "Moderator",
      value: users.filter((user) => user.role === "moderator").length,
      color: ROLE_COLORS.moderator,
    },
  ];

  // Function to get time period for trend calculation
  const getPreviousPeriodData = () => {
    let days = 7;
    if (timeRange === "30days") days = 30;
    else if (timeRange === "90days") days = 90;
    else if (timeRange === "custom" && startDate && endDate) {
      days =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
    }

    const currentPeriodData = activityData.slice(-days);
    const previousPeriodData = generateActivityData(days);

    const currentActiveUsers = currentPeriodData.reduce(
      (sum, day) => sum + day.activeUsers,
      0
    );
    const previousActiveUsers = previousPeriodData.reduce(
      (sum, day) => sum + day.activeUsers,
      0
    );

    const currentNewUsers = currentPeriodData.reduce(
      (sum, day) => sum + day.newUsers,
      0
    );
    const previousNewUsers = previousPeriodData.reduce(
      (sum, day) => sum + day.newUsers,
      0
    );

    return {
      activeUsersTrend: {
        value: Math.round(
          ((currentActiveUsers - previousActiveUsers) / previousActiveUsers) *
            100
        ),
        positive: currentActiveUsers >= previousActiveUsers,
      },
      newUsersTrend: {
        value: Math.round(
          ((currentNewUsers - previousNewUsers) / previousNewUsers) * 100
        ),
        positive: currentNewUsers >= previousNewUsers,
      },
    };
  };

  const trends = getPreviousPeriodData();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="textPrimary"
              gutterBottom
            >
              User Analytics
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track user activity, engagement, and growth metrics
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              mt: { xs: 2, sm: 0 },
              gap: 1,
            }}
          >
            <Tooltip title="Refresh data">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export data">
              <IconButton
                sx={{
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mb: 3 }} />}

        {/* Filter Bar */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="90days">Last 90 Days</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {timeRange === "custom" && (
              <>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    maxDate={endDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    minDate={startDate}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Summary Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={users.length.toLocaleString()}
              icon={<PeopleAltIcon />}
              isLoading={loading}
              color={CHART_COLORS.primary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Active Users"
              value={activeUsersCount.toLocaleString()}
              icon={<TrendingUpIcon />}
              trend={trends.activeUsersTrend}
              isLoading={loading}
              color={CHART_COLORS.success}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title={`New Users (${
                timeRange === "7days"
                  ? "7d"
                  : timeRange === "30days"
                  ? "30d"
                  : "90d"
              })`}
              value={totalNewUsers.toLocaleString()}
              icon={<PersonAddIcon />}
              trend={trends.newUsersTrend}
              isLoading={loading}
              color={CHART_COLORS.tertiary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Avg. Daily Active"
              value={avgDailyActive.toLocaleString()}
              icon={<TrendingUpIcon />}
              isLoading={loading}
              color={CHART_COLORS.quaternary}
            />
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="User Activity Trends"
              height={350}
              action={
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value="active"
                    size="small"
                    sx={{
                      height: 36,
                      fontSize: "0.875rem",
                    }}
                  >
                    <MenuItem value="active">All Metrics</MenuItem>
                    <MenuItem value="new">New Users</MenuItem>
                    <MenuItem value="returning">Returning Users</MenuItem>
                  </Select>
                </FormControl>
              }
            >
              {activityData.length === 0 ? (
                <EmptyState message="No activity data available for the selected period" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorActive"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.primary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.secondary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.secondary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorReturning"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.tertiary}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.tertiary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={alpha("#000", 0.07)}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM dd")}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: theme.palette.text.secondary,
                        fontSize: 12,
                      }}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="activeUsers"
                      stroke={CHART_COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorActive)"
                      name="Active Users"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="newUsers"
                      stroke={CHART_COLORS.secondary}
                      fillOpacity={1}
                      fill="url(#colorNew)"
                      name="New Users"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="returningUsers"
                      stroke={CHART_COLORS.tertiary}
                      fillOpacity={1}
                      fill="url(#colorReturning)"
                      name="Returning Users"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </Grid>
        </Grid>

        {/* User Table */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box p={3} pb={2}>
              <Typography
                variant="h6"
                fontWeight={600}
                color="textPrimary"
                gutterBottom
              >
                User Details
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "user" : "users"} found
              </Typography>
            </Box>

            <Divider />

            {filteredUsers.length === 0 ? (
              <EmptyState
                message={
                  searchTerm
                    ? "No users match your search criteria"
                    : "No users found"
                }
              />
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Last Login</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Signup Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            cursor: "pointer",
                          },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={user.avatar}
                              sx={{
                                mr: 2,
                                width: 36,
                                height: 36,
                              }}
                            />
                            <Typography variant="body1" fontWeight={500}>
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)
                            }
                            size="small"
                            sx={{
                              bgcolor: alpha(STATUS_COLORS[user.status], 0.1),
                              color: STATUS_COLORS[user.status],
                              fontWeight: 500,
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)
                            }
                            size="small"
                            sx={{
                              bgcolor: alpha(ROLE_COLORS[user.role], 0.1),
                              color: ROLE_COLORS[user.role],
                              fontWeight: 500,
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>{formatDate(user.signupDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default UserAnalyticsPage;
