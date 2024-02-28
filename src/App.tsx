import { Authenticated, GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers";

import routerBindings, {
    CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
// import { createClient } from "graphql-ws";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home, ForgotPassword, Login, Register, CompanyList, Create } from "./pages";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import Edit from "./pages/company/edit";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={resources}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "1JAE5a-jtZvTt-v0pVLC",
                  liveMode: "auto",
                }}
              >
                <Routes>
                  <Route path="/login" index element={<Login />} />
                  <Route path="/register" index element={<Register />} />
                  <Route path="/forgot-password" index element={<ForgotPassword />} />
                  
                  {/* The `<Route>` component is a part of the React Router library and is used to
                  define a route in your application. In this specific code snippet, the `<Route>`
                  component is defining a route that requires authentication. */}
                  <Route
                    element={
                        <Authenticated
                            key="authenticated-layout"
                            fallback={<CatchAllNavigate to="/login" />}
                        >
                            <Layout>
                                <Outlet />
                            </Layout>
                        </Authenticated>
                    }
                  >
                    <Route index element={<Home />} />
                    <Route path="/companies">
                      <Route index element={<CompanyList />} />
                      <Route path="new" element={<Create />} />
                      <Route path="edit/:id" element={<Edit />} />
                    </Route>
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
