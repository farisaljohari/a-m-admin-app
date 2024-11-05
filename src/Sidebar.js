import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard"; // Main Image
import InfoIcon from "@mui/icons-material/Info"; // About Image
import BuildIcon from "@mui/icons-material/Build"; // Projects
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Logout
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout }) => {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmLogout = () => {
    sessionStorage.removeItem("authToken");
    onLogout();
    navigate("/signin");
  };

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: "white" }}>
        <Toolbar>
          <IconButton edge="start" color="#3498db" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h6">
            <span style={{ color: "#1e00ff" }}>A&M</span>
            {"  "}
            <span style={{ color: "#ff0202" }}>Admin</span>
          </Typography>
          <img
            src="/assets/images/A&M logo.png"
            alt="Company Logo"
            style={{ width: "100px", height: "50px", marginRight: "10px" }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <img
            src="/assets/images/A&M logo.png"
            alt="Company Logo"
            style={{ width: "100px", height: "50px", marginRight: "10px" }}
          />
          <Typography variant="h6">
            <span style={{ color: "#1e00ff" }}>A&M</span> {"  "}
            <span style={{ color: "#ff0202" }}>Admin</span>
          </Typography>
        </div>
        <List>
          <ListItem button component={Link} to="/main-image">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Main Image" />
          </ListItem>
          <ListItem button component={Link} to="/about-image">
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About Image" />
          </ListItem>
          <ListItem button component={Link} to="/projects">
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
          <ListItem
            button
            onClick={handleLogoutClick}
            style={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
