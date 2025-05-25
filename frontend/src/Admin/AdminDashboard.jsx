import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";
import apiService from "../apiService";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [pendingVenues, setPendingVenues] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await apiService.getPendingVenueCount();
        setPendingVenues(res.count);
      } catch (err) {
        console.error("Failed to fetch pending venues count", err);
      }
    };

    const fetchSalesSummary = async () => {
      try {
        const res = await apiService.getSalesSummary();
        setDailySales(res.daily.count);
        setWeeklySales(res.weekly.count);
        setDailyRevenue(res.daily.total_amount);
        setWeeklyRevenue(res.weekly.total_amount);
      } catch (err) {
        console.error("Failed to fetch sales summary", err);
      }
    };

    fetchPendingCount();
    fetchSalesSummary();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
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

        <Grid container spacing={3} mb={5}>
          {[
            {
              label: "Waiting Venue Requests",
              value: pendingVenues,
              icon: <HourglassEmptyIcon color="warning" />,
              color: "#FFF9C4",
            },
            {
              label: "Daily Ticket Sales",
              value: `${dailySales} tickets`,
              sub: `${dailyRevenue.toLocaleString()} ₺`,
              icon: <TrendingUpIcon color="primary" />,
              color: "#E3F2FD",
            },
            {
              label: "Weekly Ticket Sales",
              value: `${weeklySales} tickets`,
              sub: `${weeklyRevenue.toLocaleString()} ₺`,
              icon: <MonetizationOnIcon color="success" />,
              color: "#E8F5E9",
            },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  boxShadow: 4,
                  backgroundColor: item.color,
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {item.icon}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {item.value}
                    </Typography>
                    {item.sub && (
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="text.secondary"
                        mt={0.5}
                      >
                        {item.sub} revenue
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom>
          Management
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
