import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import DataProvider from "./context/DataProvider";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import CreatePost from "./components/create/CreatePost";
import DetailView from "./components/details/DetailView";
import Update from "./components/create/Update";
import Login from "./components/account/Login";
import { API } from "./service/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/profile/Profile";

// ---------------- PRIVATE ROUTE ----------------
const PrivateRoute = ({ isAuthenticated, setIsAuthenticated }) => {
  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate replace to="/account" />;

  return (
    <>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <Outlet />
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await API.checkAuth();
        setIsAuthenticated(res.data.loggedIn);
      } catch {
        setIsAuthenticated(false);
      }
    };
    verifyUser();
  }, []);

  return (
    <DataProvider>
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <Box style={{ marginTop: 64 }}>
          <Routes>
            {/* PUBLIC */}
            <Route
              path="/account"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />

            {/* PROTECTED */}
            <Route
              path="/"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            >
              <Route index element={<Home />} />
              <Route path="create" element={<CreatePost />} />
              <Route path="details/:id" element={<DetailView />} />
              <Route path="update/:id" element={<Update />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:username" element={<Profile />} />
            </Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
