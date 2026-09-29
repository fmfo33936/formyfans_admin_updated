import AdminPannel from "../screens/adminPannel/dashboard";
import Creators from "../screens/adminPannel/creators/Creators";
import Orders from "../screens/adminPannel/orders/Orders";
import Users from "../screens/adminPannel/users/Users";
import OrderDetail from "../screens/adminPannel/orderDetail";
// import AddProducts from "../screens/adminPannel/addProducts";
// import Notifications from "../screens/settings/notifications/notifications";
import Subscription from "../screens/adminPannel/subscription";
import CreditPricing from "../screens/adminPannel/creditPricing";
import CampaignObjective from "../screens/adminPannel/campaignObjective";
import CampaignCategory from "../screens/adminPannel/campaignCategory";
import Campaigns from "../screens/adminPannel/campaigns";
import Deals from "../screens/adminPannel/deals";
import DealDetail from "../screens/adminPannel/deals/dealDetail";
import Setting from "../screens/settings/setting";
import Login from "../auth/login";
import ForgotPassword from "../auth/forgotPassword";
import OtpVerification from "../auth/otpVerification";
import ResetPassword from "../auth/resetPassword";



const AUTH_LAYOUT = [
  {
    id: 1,
    name: "login",
    path: "/auth/login",
    component: <Login />,
  },
  {
    id: 2,
    name: "forgot-password",
    path: "/auth/forgot-password",
    component: <ForgotPassword />,
  },
  {
    id : 3,
    name: "otp-verification",
    path: "/auth/otp-verification",
    component: <OtpVerification />,
  },
  {
    id: 4,
    name: "reset-password",
    path: "/auth/reset-password",
    component: <ResetPassword />,
  }
];

const APP_LAYOUT = [
  {
    id: 1,
    name: "admin-panel",
    path: "/app/admin-panel",
    component: <AdminPannel />,
  },
  {
    id: 2,
    name: "users",
    path: "/app/users",
    component: <Users />,
  },
  {
    id: 3,
    name: "orders",
    path: "/app/orders",
    component: <Orders />,
  },
  {
    id: 4,
    name: "creators",
    path: "/app/creators",
    component: <Creators />,
  },
  {
    id: 5,
    name: "subscription",
    path: "/app/subscription",
    component: <Subscription />,
  },
  {
    id: 13,
    name: "credit-pricing",
    path: "/app/credit-pricing",
    component: <CreditPricing />,
  },
  {
    id: 14,
    name: "credits-pricing-alias",
    path: "/app/credits/pricing",
    component: <CreditPricing />,
  },
  {
    id: 15,
    name: "credits-alias",
    path: "/app/credits",
    component: <CreditPricing />,
  },
  {
    id: 10,
    name: "deals",
    path: "/app/deals",
    component: <Deals />,
  },
  {
    id: 11,
    name: "deal-detail",
    path: "/app/deal-detail",
    component: <DealDetail />,
  },
  {
    id: 12,
    name: "campaigns",
    path: "/app/campaigns",
    component: <Campaigns />,
  },
  {
    id: 6,
    name: "campaign-objective",
    path: "/app/campaign-objective",
    component: <CampaignObjective />,
  },
  {
    id: 9,
    name: "campaign-category",
    path: "/app/campaign-category",
    component: <CampaignCategory />,
  },
  // {
  //   id: 6,
  //   name: "add-products",
  //   path: "/app/add-products",
  //   component: <AddProducts />,
  // },
  {
    id: 7,
    name: "order-detail",
    path: "/app/order-detail",
    component: <OrderDetail />,
  },
  // {
  //   id: 7,
  //   name: "notifications",
  //   path: "/app/notifications",
  //   component: <Notifications />,
  // },
  {
    id: 8,
    name: "settings",
    path: "/app/settings",
    component: <Setting />,
  },
];
export { APP_LAYOUT , AUTH_LAYOUT };
