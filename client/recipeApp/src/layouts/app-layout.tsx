import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    Tooltip
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { colors } from "../assets/_colors";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const drawerWidth = 60;

export function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/auth/login");
    };

    const menuItems = [
        // { label: "בית", icon: <HomeIcon />, to: "/" },
        { label: "חיפוש", icon: <SearchRoundedIcon />, to: "/search", tooltip: "חיפוש מתכונים" },
        { label: "חיפוש AI", icon: <AutoAwesomeIcon />, to: "/AI", tooltip: "חיפוש AI" },
        { label: "פרופיל", icon: <PersonIcon />, to: "/profile", tooltip: "הפרופיל שלי" },
        { label: "יצירת מתכון", icon: <AddIcon />, to: "/recipes/new", tooltip: "מתכון חדש" },
    ];

    return (
        <Box sx={{ display: "flex" }} >
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
                                </ListItemButton>
                            </Tooltip>
                        ))}
                    </div>

                    <Tooltip title={'התנתקות'} placement="left">
                        <ListItemButton onClick={onLogout}>
                            <ListItemIcon sx={{ minWidth: 35 }}>
                                <LogoutIcon sx={{ color: colors.COLORFUL["crimson_red"] }} />
                            </ListItemIcon>
                        </ListItemButton>
                    </Tooltip>
                </List>
            </Drawer>

            {/* Content */}
            <Box component="main" sx={{ minHeight: "100vh", width: "100%" }}>
                {/* backgroundColor: "#f8f8f8", */}
                <Outlet />
            </Box>
        </Box>
    );
}
