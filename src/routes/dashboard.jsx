// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
// core components/views
import LoginPage from "views/Main/LoginPage.jsx";
import RegisterPage from "views/Main/RegisterPage.jsx";
import DukungPage from "views/Dashboard/DukungPage.jsx";
import AdminPage from "views/Dashboard/AdminPage.jsx";
import DaftarDukunganPage from "views/Dashboard/DaftarDukunganPage.jsx";
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/admin",
    sidebarName: "Admin",
    navbarName: "Admin",
    icon: BubbleChart,
    component: AdminPage
  },
  {
    path: "/user",
    sidebarName: "Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },
  {
    path: "/daftar-dukungan",
    sidebarName: "Daftar Dukungan",
    navbarName: "Daftar Dukungan",
    icon: LibraryBooks,
    component: DaftarDukunganPage
  },
  {
    path: "/dukung",
    sidebarName: "Dukung",
    navbarName: "Dukung",
    icon: "content_paste",
    component: DukungPage
  },
  {
    path: "/login",
    sidebarName: "Login",
    navbarName: "Login",
    icon: "",
    component: LoginPage
  },
  {
    path: "/register",
    sidebarName: "Register",
    navbarName: "Register",
    icon: "",
    component: RegisterPage
  },
];

export default dashboardRoutes;
