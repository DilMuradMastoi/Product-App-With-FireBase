import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

import { Link, useNavigate } from "react-router-dom"; // Note: using 'react-router-dom'
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseconfig";
import { useCartSync } from "../hooks/useCartSync"; // 1. Import the hook

const pages = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Cart", path: "/cart" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function ResponsiveAppBar() {
  // 2. Call hook here to sync Redux <-> Firestore
  useCartSync();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Logout Function
  const logoutUser = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Avatar Menu Clicks
  const handleSettingClick = (setting) => {
    handleCloseUserMenu();

    if (setting === "Logout") {
      logoutUser();
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              mr: 3,
              color: "inherit",
              textDecoration: "none",
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".2rem",
            }}
          >
            MY APP
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  {page.name}
                </MenuItem>
              ))}

              {/* Logout in Mobile */}
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  logoutUser();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              display: { xs: "flex", md: "none" },
            }}
          >
            MY APP
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ color: "white" }}
              >
                {page.name}
              </Button>
            ))}

            {/* Logout Button */}
            <Button
              color="error"
              variant="contained"
              onClick={logoutUser}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Box>

          {/* Avatar */}
          <Box>
            <Tooltip title="User Settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleSettingClick(setting)}
                >
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}