// src/Admin/AdminDashboard.jsx

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
import PersonIcon from "@mui/icons-material/Person";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import PaymentIcon from "@mui/icons-material/Payment";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Dummy data
  const [pendingVenues] = useState(5);
  const [pendingEvents] = useState(3);
  const [dailySales] = useState(124);
  const [weeklySales] = useState(842);

  const [recentLogins] = useState([
    { username: "ayse@example.com", lastLogin: "2025-05-24T12:41:23" },
    { username: "mehmet@example.com", lastLogin: "2025-05-24T11:41:23" },
    { username: "ali@example.com", lastLogin: "2025-05-23T13:41:23" },
  ]);

  const [alerts] = useState([
    { message: "Ödeme hatası tespit edildi", date: "2025-05-24T13:11:23" },
    { message: "Etkinlik silinme talebi var", date: "2025-05-24T12:11:23" },
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
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ara: etkinlik, venue, kullanıcı..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": {
                  border: "none",
                },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={() => navigate("/profile")}
              sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
            >
              Profile
            </Button>
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
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* KPI Kartları */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          {[
            {
              label: "Bekleyen Venue Onayları",
              value: pendingVenues,
            },
            {
              label: "Bekleyen Etkinlik Onayları",
              value: pendingEvents,
            },
            {
              label: "Günlük Bilet Satışı",
              value: dailySales,
            },
            {
              label: "Haftalık Bilet Satışı",
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
              label: "Venue Yönetimi",
              icon: <LocationOnIcon fontSize="large" />,
              to: "/admin/venues",
            },
            {
              label: "Etkinlik Onayları",
              icon: <EventIcon fontSize="large" />,
              to: "/admin/events/pending",
            },
            {
              label: "Kullanıcı Yönetimi",
              icon: <PeopleIcon fontSize="large" />,
              to: "/admin/users",
            },
            {
              label: "Raporlar & Analiz",
              icon: <BarChartIcon fontSize="large" />,
              to: "/admin/reports",
            },
            {
              label: "Ödeme İzleme",
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
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    {sec.icon}
                    <Typography variant="subtitle1">
                      {sec.label}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Listeler */}
        <Grid container spacing={4}>
          {/* Son Giriş Yapan Kullanıcılar */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Son Giriş Yapan Kullanıcılar
                </Typography>
                <List dense>
                  {recentLogins.map((u, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <Divider component="li" />}
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={u.username}
                          secondary={new Date(u.lastLogin).toLocaleString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Uyarılar */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Uyarılar
                </Typography>
                <List dense>
                  {alerts.map((a, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <Divider component="li" />}
                      <ListItem>
                        <ListItemIcon>
                          <WarningAmberIcon color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary={a.message}
                          secondary={new Date(a.date).toLocaleString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
