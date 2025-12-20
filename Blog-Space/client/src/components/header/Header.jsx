import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  styled,
  Button,
  IconButton,
  Drawer,
  Box,
  Divider,
  Avatar,
  Typography
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/blog_space_3-removebg-preview.png";
import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";

/* APP BAR */
const Navbar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  color: #111;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

/* TOOLBAR */
const NavContainer = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 72px;
  padding: 0 24px;
`;


const LogoImg = styled("img")(({ theme }) => ({
  height: 80, // default height
  cursor: "pointer",
  [theme.breakpoints.down("md")]: {
    height: 80, // medium screens
  },
  [theme.breakpoints.down("sm")]: {
    height: 65, // small screens
  },
  [theme.breakpoints.down("xs")]: {
    height: 50, // extra small screens
  },
}));

/* DESKTOP NAV */
const NavLinks = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 16,

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

/* BASE BUTTON */
const BaseBtn = styled(Button)`
  text-transform: none;
  font-weight: 600;
  border-radius: 10px;
  padding: 6px 18px;
  transition: all 0.25s ease;
`;

/* PRIMARY */
const PrimaryBtn = styled(BaseBtn)`
  background: #e63946;
  color: #fff;
  padding: 7px 20px;

  &:hover {
    background: #d62828;
    box-shadow: 0 1px 6px rgba(166, 39, 39, 0.4);
  }
`;

/* OUTLINED */
const OutlineBtn = styled(BaseBtn)`
  border: 2px solid #e63946;
  color: #e63946;

  &:hover {
    background: #e63946;
    color: #fff;
  }
`;

/* AVATAR */
const ProfileAvatar = styled(Avatar)`
  width: 42px !important;
  height: 42px !important;
  cursor: pointer;
  background: linear-gradient(135deg, #d62828, #e63946);
  font-weight: 700;
`;

/* DRAWER */
const DrawerBox = styled(Box)`
  width: 280px;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = ({ isUserAuthenticated }) => {
  const navigate = useNavigate();
  const { account, setAccount } = useContext(DataContext);
  const [openDrawer, setOpenDrawer] = useState(false);

  const logout = async () => {
    try {
      await API.logoutUser();
    } catch (error) {
      console.log("Logout failed");
    } finally {
      localStorage.removeItem("user");
      setAccount({ name: "", username: "" });
      isUserAuthenticated(false);
      navigate("/account");
    }
  };

  const userInitial = account?.name
    ? account.name[0].toUpperCase()
    : "U";

  return (
    <Navbar position="sticky">
      <NavContainer>
        <LogoImg src={logo} onClick={() => navigate("/")} />

        {/* DESKTOP */}
        <NavLinks>
          <OutlineBtn
            startIcon={<DashboardIcon />}
            onClick={() => navigate("/")}
          >
            Dashboard
          </OutlineBtn>

          <PrimaryBtn
            onClick={() => navigate("/create")}
          >
            ➕ Create Blog
          </PrimaryBtn>

          <OutlineBtn
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </OutlineBtn>

          <ProfileAvatar onClick={() => navigate("/profile")}>
            {userInitial}
          </ProfileAvatar>
        </NavLinks>

        {/* MOBILE */}
        <IconButton
          sx={{ display: { md: "none" } }}
          onClick={() => setOpenDrawer(true)}
        >
          <MenuIcon fontSize="medium" />
        </IconButton>
      </NavContainer>

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <DrawerBox>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Menu
            </Typography>
            <IconButton onClick={() => setOpenDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Box textAlign="center">
            <ProfileAvatar
              sx={{ mx: "auto", mb: 1 }}
              onClick={() => navigate("/profile")}
            >
              {userInitial}
            </ProfileAvatar>
            <Typography fontWeight={600}>
              {account?.name}
            </Typography>
          </Box>

          <Divider />

          <PrimaryBtn fullWidth onClick={() => navigate("/")}>
            Dashboard
          </PrimaryBtn>

          <PrimaryBtn fullWidth onClick={() => navigate("/create")}>
            ➕ Create Blog
          </PrimaryBtn>

          <OutlineBtn fullWidth onClick={logout}>
            Logout
          </OutlineBtn>
        </DrawerBox>
      </Drawer>
    </Navbar>
  );
};

export default Header;
