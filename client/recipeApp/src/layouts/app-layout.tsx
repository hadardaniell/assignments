import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { colors } from "../assets/_colors";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";


const drawerWidth = 60;

export function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth/login");
    };

    const menuItems = [
        // { label: "בית", icon: <HomeIcon />, to: "/" },
        { label: "חיפוש", icon: <SearchRoundedIcon />, to: "/search", tooltip: "חיפוש מתכונים" },
        { label: "פרופיל", icon: <PersonIcon />, to: "/profile", tooltip: "הפרופיל שלי" },
        { label: "יצירת מתכון", icon: <AddIcon />, to: "/recipes/new", tooltip: "מתכון חדש" },
    ];

    return (
        <Box sx={{ display: "flex" }} >
            {/* Top bar
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6">Recipe App</Typography>
        </Toolbar>
      </AppBar> */}

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
            >
                {/* <Toolbar /> */}
                <List sx={{
                    display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%",
                }}>
                    <div style={{ height: "100%" }}>
                        {menuItems.map((item) => (
                             <Tooltip title={item.tooltip} placement="left" key={item.to}>
                            <ListItemButton
                                key={item.to}
                                selected={location.pathname === item.to}
                                onClick={() => navigate(item.to)}
                            >
                                <ListItemIcon sx={{ minWidth: 35 }}>{item.icon}</ListItemIcon>
                                {/* <ListItemText primary={item.label} /> */}
                            </ListItemButton>
                        </Tooltip>
                        ))}
                    </div>

                    <ListItemButton onClick={onLogout}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <LogoutIcon sx={{ color: colors.COLORFUL["crimson_red"] }} />
                        </ListItemIcon>
                        {/* <ListItemText primary="התנתקות" /> */}
                    </ListItemButton>
                </List>
            </Drawer>

            {/* Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh" }}>
                 {/* backgroundColor: "#f8f8f8", */}
                <Outlet />
            </Box>
        </Box>
    );
}
