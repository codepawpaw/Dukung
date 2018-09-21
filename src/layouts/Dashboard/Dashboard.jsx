/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "assets/img/image.png";
import logo from "assets/img/electionlogo.png";

// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import LoginPage from "views/Main/LoginPage.jsx";
import RegisterPage from "views/Main/RegisterPage.jsx";
import DukungPage from "views/Dashboard/DukungPage.jsx";
import AdminPage from "views/Dashboard/AdminPage.jsx";
import DaftarDukunganPage from "views/Dashboard/DaftarDukunganPage.jsx";
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import MainPage from "views/Main/MainPage.jsx";
import EditProfile from "views/Main/EditProfile.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
import Icons from "views/Icons/Icons.jsx";
import Maps from "views/Maps/Maps.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";

const switchRoutes = (
  <Switch>
    {dashboardRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);


const adminRoutes = [
  {
    path: "/admin",
    sidebarName: "Admin",
    navbarName: "Admin",
    icon: BubbleChart,
    component: AdminPage
  },
  { redirect: true, path: "/", to: "/admin", navbarName: "Redirect" }
]

const adminSwitchRoutes = (
  <Switch>
    {adminRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

const authenticatedUserRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/daftar-dukungan",
    sidebarName: "Daftar Dukungan",
    navbarName: "Daftar Dukungan",
    icon: LibraryBooks,
    component: DaftarDukunganPage
  },
  {
    path: "/editProfile",
    sidebarName: "Edit Profile",
    navbarName: "Edit Profile",
    icon: LibraryBooks,
    component: EditProfile
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

const authenticatedUserSwitchRoutes = (
  <Switch>
    {authenticatedUserRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);

const nonAuthenticatedUserRoutes = [
  {
    path: "/dukung",
    sidebarName: "Dukung",
    navbarName: "Dukung",
    icon: "content_paste",
    component: DukungPage
  },
  {
    path: "/profiles",
    sidebarName: "Profile",
    navbarName: "Profile",
    icon: "content_paste",
    component: UserProfile
  },
  {
    path: "/login",
    sidebarName: "Login",
    navbarName: "Login",
    icon: "content_paste",
    component: LoginPage
  },
  { redirect: true, path: "/", to: "/login", navbarName: "Redirect" }
]

const nonAuthenticatedUserSwitchRoutes = (
  <Switch>
    {nonAuthenticatedUserRoutes.map((prop, key) => {
      if (prop.redirect)
        return <Redirect from={prop.path} to={prop.to} key={key} />;
      return <Route path={prop.path} component={prop.component} key={key} />;
    })}
  </Switch>
);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return this.props.location.pathname !== "/maps";
  }

  isRenderSideBar() {
    return this.props.location.pathname !== "/" && this.props.location.pathname !== "/register";
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  isAuthenticated() {
    return sessionStorage.getItem("user") !== null
  }

  isAdmin() {
    return sessionStorage.getItem("admin") !== null
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div className={classes.wrapper}>

        { this.isRenderSideBar() && this.isAuthenticated() ? (
          
          <Sidebar
            routes={authenticatedUserRoutes}
            logoText={"Dukung"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
        ) : (
          <div/>
        )} */}

        { this.isRenderSideBar() && !this.isAuthenticated() && !this.isAdmin() ? (
          <Sidebar
            routes={nonAuthenticatedUserRoutes}
            logoText={"Dukung"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
        ) : (
          <div/>
        )}

        { this.isRenderSideBar() && this.isAdmin() ? (
          <Sidebar
            routes={adminRoutes}
            logoText={"Dukung"}
            logo={logo}
            image={image}
            handleDrawerToggle={this.handleDrawerToggle}
            open={this.state.mobileOpen}
            color="blue"
            {...rest}
          />
        ) : (
          <div/>
        )}

        <div className={classes.mainPanel} ref="mainPanel">
          { this.isRenderSideBar() ? (
            <Header
              routes={dashboardRoutes}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />
          ): (
            <div/>
          )}

          {
            this.isAuthenticated() && !this.isAdmin() ? (
              <div className={classes.content}>
                <div className={classes.container}>{authenticatedUserSwitchRoutes}</div>
              </div>
            ) : (
              <div/>
            )
          }

          {
            !this.isAuthenticated() && !this.isAdmin() ? (
              <div className={classes.content}>
                <div className={classes.container}>{nonAuthenticatedUserSwitchRoutes}</div>
              </div>
            ) : (
              <div/>
            )
          }

          {
            this.isAdmin() ? (
              <div className={classes.content}>
                <div className={classes.container}>{adminSwitchRoutes}</div>
              </div>
            ) : (
              <div/>
            )
          }

          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(App);
