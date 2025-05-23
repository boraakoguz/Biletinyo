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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../apiService";
const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({ totalSales: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const now = new Date();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user || user.user_type !== 1) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token && !!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const userId = user ? Number(user.id) : null;

  useEffect(() => {
    (async () => {
      try {
        const evs = await apiService.getEventsByOrganizer(userId);
        setEvents(evs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);
  // --- Mock data for development ---

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Bugün başlangıcı

  // Arama ve tarih filtreleri
  const filtered = events.filter((e) =>
    e.event_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcoming = filtered.filter((e) => new Date(e.event_date) >= now);
  const past = filtered.filter((e) => new Date(e.event_date) < now);

  const renderEventCard = (evt) => (
    <Grid item xs={12} sm={6} md={4} key={evt.event_id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6">{evt.event_title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(evt.event_date).toLocaleString("tr-TR")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {evt.venue_name}, {evt.location}
          </Typography>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate(`/organizer/events/${evt.event_id}`)}
            >
              Yönet
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                navigate(`/organizer/events/${evt.event_id}/categories`)
              }
            >
              Kategorileri Düzenle
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );

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
              placeholder="Etkinlik, mekan ya da sanatçı ara..."
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
            {isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/profile")}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  sx={{
                    borderColor: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Üye Girişi
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/signin")}
                  sx={{
                    borderColor: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Üye Ol
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* İçerik */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Organizatör Panosu
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          <Card sx={{ flex: 1, minWidth: 150 }}>
            <CardContent>
              <Typography variant="subtitle1">Toplam Satış</Typography>
              <Typography variant="h5">{summary.totalSales}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 150 }}>
            <CardContent>
              <Typography variant="subtitle1">Toplam Gelir</Typography>
              <Typography variant="h5">{summary.totalRevenue} TL</Typography>
            </CardContent>
          </Card>
        </Stack>

        <Typography variant="h5" gutterBottom>
          Yaklaşan Etkinlikler
        </Typography>
        {upcoming.length ? (
          <Grid container spacing={3} mb={4}>
            {upcoming.map(renderEventCard)}
          </Grid>
        ) : (
          <Typography color="text.secondary" mb={4}>
            Yaklaşan etkinlik yok.
          </Typography>
        )}

        <Typography variant="h5" gutterBottom>
          Geçmiş Etkinlikler
        </Typography>
        {past.length ? (
          <Grid container spacing={3}>
            {past.map(renderEventCard)}
          </Grid>
        ) : (
          <Typography color="text.secondary">Geçmiş etkinlik yok.</Typography>
        )}
      </Container>
    </>
  );
};

export default OrganizerDashboard;
