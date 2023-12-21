import { Authenticated, HttpError, Refine } from "@refinedev/core";

import { KBarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
  RefineSnackbarProvider,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import DevicesOtherOutlinedIcon from "@mui/icons-material/DevicesOtherOutlined";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import StoreOutlined from "@mui/icons-material/StoreOutlined";
import PeopleOutlineOutlined from "@mui/icons-material/PeopleOutlineOutlined";
import Dashboard from "@mui/icons-material/Dashboard";

import { authProvider } from "./authProvider";
import { DashboardPage } from "./pages/dashboard";

import { Login } from "./pages/auth";
import { ColorModeContextProvider } from "./contexts";
import { Header, Title } from "./components";
import axios from "axios";
import { useEffect, useState } from "react";
import { FarmList } from "./pages/farm/list";
import { DeviceList } from "./pages/device/list";
import { DeviceProfileList } from "./pages/deviceProfile/list";
import { CustomerList } from "./pages/customer/list";

const API_URL = "http://localhost:8000/api";

const App: React.FC = () => {
  const [customerResources, setCustomerResources] = useState<boolean>(false);
  const [scope, setScope] = useState(localStorage.getItem("currentUserScope"));

  useEffect(() => {
    const handleScopeUpdate = () => {
      setScope(localStorage.getItem("currentUserScope"));
    };
    window.addEventListener("custom:scope-update", handleScopeUpdate);
    return () => {
      window.removeEventListener("custom:scope-update", handleScopeUpdate);
    };
  }, []);

  useEffect(() => {
    if (scope === "tenant") {
      setCustomerResources(false);
    } else if (scope === "customer") {
      setCustomerResources(true);
    }
    console.log(customerResources);
  }, [scope]);

  const axiosInstance = axios.create();

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const customError = {
        ...error,
        message: error.response?.data?.detail,
        statusCode: error.response?.status,
      };

      return Promise.reject(customError);
    }
  );
  return (
    <BrowserRouter>
      <KBarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(API_URL, axiosInstance)}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
              notificationProvider={notificationProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <Dashboard />,
                  },
                },
                {
                  name: "farms",
                  list: FarmList,
                  meta: { icon: <StoreOutlined /> },
                },
                {
                  name: "device_profiles",
                  list: DeviceProfileList,
                  meta: {
                    icon: <CategoryOutlined />,
                    label: "Device Profiles",
                  },
                },
                {
                  name: "devices",
                  list: DeviceList,
                  meta: { icon: <DeviceThermostatIcon /> },
                },
                {
                  name: "customers",
                  list: CustomerList,
                  meta: {
                    icon: <PeopleOutlineOutlined />,
                    hide: customerResources,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header} Title={Title}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  {scope === "tenant" && (
                    <Route path="customers">
                      <Route index element={<CustomerList />} />
                    </Route>
                  )}

                  <Route path="">
                    <Route index element={<DashboardPage />} />
                  </Route>
                  <Route path="farms">
                    <Route index element={<FarmList />} />
                  </Route>
                  <Route path="device_profiles">
                    <Route index element={<DeviceProfileList />} />
                  </Route>
                  <Route path="devices">
                    <Route index element={<DeviceList />} />
                  </Route>

                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </KBarProvider>
    </BrowserRouter>
  );
};

export default App;
