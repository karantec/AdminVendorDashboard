import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UserAccountList from "./components/ui/user-management/user-list/UserAccountList";
import UserCaseManagement from "./components/ui/user-management/UserCaseManagement";
import UserAnalyticsPage from "./components/ui/user-management/UserAnalyticsPage";
import UserOrdersPage from "./components/ui/user-management/UserOrdersPage";
import ViewAllOrders from "./components/ui/order-management/ViewAllOrders";
import OrderStatusPage from "./components/ui/order-management/TrackOrderStatus";
import OrderReassigned from "./components/ui/order-management/OrderReassigned";
import HandleOrderIssues from "./components/ui/order-management/HandleOrderIssue";
import ApproveVendorPage from "./components/ui/vendor-management/vendro-approval/ApproveVendorpage";
import VendorAccountManagement from "./components/ui/vendor-management/Vendor-Account-Management/VendorAccountManagement";
import VendorStockUpdates from "./components/ui/vendor-management/Vendor-stock-updates/VendorStockUpdates";
import VendorAnalytics from "./components/ui/vendor-management/VendorAnalytics";
import AddProductPage from "./components/ui/product-management/AddProductPage";
import ViewProducts from "./components/ui/product-management/view-product/ViewProduct";
import ProductPricingManagement from "./components/ui/product-management/ProductPricingManagement";
import CategoryManagement from "./components/ui/Category-Management/CategoryManagement";
import ViewCategory from "./components/ui/Category-Management/ViewCategory";
import VendorLoginApproval from "./components/ui/vendor-portal-settings/VendorLoginApproval";
import ViewVendorStockUpdates from "./components/ui/vendor-portal-settings/ViewVendorStockUpdates";
import ProcessStockExchangeRequest from "./components/ui/vendor-portal-settings/ProcessStockExchangeRequest";
import ShowOrderAssignmentToVendors from "./components/ui/vendor-portal-settings/ShowOrderAssignmentToVendors";
import SystemPerformance from "./components/ui/vendor-portal-settings/SystemPerformance";
import PaymentGatewaySetting from "./components/ui/Platform-setting/PaymentGatewaySetting";
import DeliveryZoneManagement from "./components/ui/Platform-setting/DeliveryZoneManagement";
import CommissionSetting from "./components/ui/Platform-setting/CommissionSetting";
import Performance from "./components/ui/Platform-setting/Performance";
import AppSetting from "./components/ui/Platform-setting/AppSetting";
import SalesReport from "./components/ui/Analytics/SalesReport";
import VendorPerformance from "./components/ui/Analytics/VendorPerformance";
import ProductPopularity from "./components/ui/Platform-setting/ProductPopularity";
import UserEngagementMetrics from "./components/ui/Platform-setting/UserEngagementMetrics";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/UserAccountList" element={<UserAccountList />} />
            <Route path="/UserCaseManagement" element={<UserCaseManagement />} /> 
            <Route path="/UserAnalyticsPage" element={<UserAnalyticsPage />} />
            <Route path="/UserOrdersPage" element={<UserOrdersPage />} />

            {/* Order Management */}
            <Route path="/ViewAllOrder" element={<ViewAllOrders />} />
            <Route path="/TrackOrderStatus" element={<OrderStatusPage />} />
            <Route path="/OrderReassigned" element={<OrderReassigned />} />
            <Route path="/HandleOrderIssue" element={<HandleOrderIssues />} />

            {/* Vendor Management */}
            <Route path="/ApproveVendorPage" element={<ApproveVendorPage />} />
            <Route path="/VendorAccountManagement" element={<VendorAccountManagement />} />
            <Route path="/VendorStockUpdates" element={<VendorStockUpdates />} />
            <Route path="/VendorAnalytics" element={<VendorAnalytics />} />

            {/* Product Managment */}
            <Route path="/AddProductPage" element={<AddProductPage />} />
            <Route path="/ViewProduct" element={<ViewProducts />} />
            <Route path="/ProductPricingManagement" element={<ProductPricingManagement />} />

            {/* Category Management */}
            <Route path="/CategoryManagement" element={<CategoryManagement />} />
            <Route path="/ViewCategory" element={<ViewCategory />} />

            {/* Venor Portal Setting */}
            <Route path="/VendorLoginApproval" element={<VendorLoginApproval />} />
            <Route path="/ViewVendorStockUpdates" element={<ViewVendorStockUpdates />} />
            <Route path="/ProcessStockExchangeRequest" element={<ProcessStockExchangeRequest />} />
            <Route path="/ShowOrderAssignmentToVendor" element={<ShowOrderAssignmentToVendors />} />
            <Route path="/SystemPerformance" element={<SystemPerformance />} />

            {/* Platform Setting */}
            <Route path="/PaymentGatewaySetting" element={<PaymentGatewaySetting />} />
            <Route path="/DeliveryZoneManagement" element={<DeliveryZoneManagement />} />
            <Route path="/CommissionSetting" element={<CommissionSetting />} />
            <Route path="/AppSetting" element={<AppSetting />} />
            <Route path="/Performance" element={<Performance />} />

            {/* Analytics */}
            <Route path="/SalesReport" element={<SalesReport />} />
            <Route path="/VendorPerformance" element={<VendorPerformance />} />
            <Route path="/ProductPopularity" element={<ProductPopularity />} />
            <Route path="/UserEngagementMetrics" element={<UserEngagementMetrics />} />


            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
