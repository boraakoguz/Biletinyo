import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  Stack,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import apiService from "../apiService";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dummy data
  const [pendingVenues, setPendingVenues] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await apiService.getPendingVenueCount();
        setPendingVenues(res.count);
      } catch (err) {
        console.error("Failed to fetch pending venues count", err);
      }
    };
    fetchPendingCount();
  }, []);
  const [dailySales] = useState(124);
  const [weeklySales] = useState(842);

  const [recentLogins] = useState([
    { username: "ayse@example.com", lastLogin: "2025-05-24T12:41:23" },
    { username: "mehmet@example.com", lastLogin: "2025-05-24T11:41:23" },
    { username: "ali@example.com", lastLogin: "2025-05-23T13:41:23" },
  ]);

  const [alerts] = useState([
    { message: "Payment error occured", date: "2025-05-24T13:11:23" },
    { message: "Event deletion request", date: "2025-05-24T12:11:23" },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Global Header */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontStyle: "italic",
                fontWeight: "bold",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/dashboard")}
            >
              Biletinyo
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                sx={{
                  borderColor: "white",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          {[
            {
              label: "Waiting Venue Requests",
              value: pendingVenues,
            },
            {
              label: "Daily Ticket Sales",
              value: dailySales,
            },
            {
              label: "Weekly Ticket Sales",
              value: weeklySales,
            },
          ].map((item) => (
            <Card
              key={item.label}
              sx={{ flex: 1, minWidth: 140, boxShadow: 3 }}
            >
              <CardContent>
                <Typography variant="subtitle1">{item.label}</Typography>
                <Typography variant="h5">{item.value}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Admin Alt Sayfa Navigasyonu */}
        <Typography variant="h6" gutterBottom>
          Yönetim Bölümleri
        </Typography>
        <Grid container spacing={3} mb={4}>
          {[
            {
              label: "Venue Management",
              icon: <LocationOnIcon fontSize="large" />,
              to: "/admin/venues",
            },
            {
              label: "Reports & Analysis",
              icon: <BarChartIcon fontSize="large" />,
              to: "/admin/reports",
            },
            {
              label: "Ticket Sales Report",
              icon: <PaymentIcon fontSize="large" />,
              to: "/admin/payments",
            },
          ].map((sec) => (
            <Grid item xs={12} sm={6} md={4} key={sec.label}>
              <Card
                onClick={() => navigate(sec.to)}
                sx={{
                  boxShadow: 3,
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {sec.icon}
                    <Typography variant="subtitle1">{sec.label}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
