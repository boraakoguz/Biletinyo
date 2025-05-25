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
  Chip,
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
  const [followerCount, setFollowerCount] = useState(0);
  const now = new Date();
  const [requestedVenues, setRequestedVenues] = useState([]);

  useEffect(() => {
    localStorage.removeItem("draftEvent");
    localStorage.removeItem("draftImages");
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const venues = await apiService.getRequestedVenues();
        setRequestedVenues(venues);
      } catch (e) {
        console.error("Failed to fetch requested venues", e);
      }
    })();
  }, []);

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

  const fetchFollowerCount = async () => {
    try {
      const counts = await apiService.getFollowerCounts();
      const count = counts.find((c) => c.organizer_id === Number(userId));
      if (count) setFollowerCount(count.follower_count);
    } catch (err) {
      console.error("Error fetching follower count:", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const evs = await apiService.getEventsByOrganizer(userId);
        setEvents(evs);

        await fetchFollowerCount();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      try {
        const [evs, revenueData] = await Promise.all([
          apiService.getEventsByOrganizer(userId),
          apiService.getOrganizerRevenue(userId),
        ]);

        setEvents(evs);
        setSummary((prev) => ({
          ...prev,
          totalRevenue: revenueData.total_revenue,
        }));

        await fetchFollowerCount();
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

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
            {new Date(`${evt.event_date}T${evt.event_time}`).toLocaleString(
              "tr-TR"
            )}
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
              Manage
            </Button>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );

  return (
    <>
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
              placeholder="Search event, venue or artist..."
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
                  Login
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
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* İçerik */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Organizer Dashboard
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
          <Card sx={{ flex: 1, minWidth: 150 }}>
            <CardContent>
              <Typography variant="subtitle1">Takipçi Sayısı</Typography>
              <Typography variant="h5">{followerCount}</Typography>
            </CardContent>
          </Card>
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/organizer/create")}
          >
            Create New Event
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          Upcoming Events
        </Typography>
        {upcoming.length ? (
          <Grid container spacing={3} mb={4}>
            {upcoming.map(renderEventCard)}
          </Grid>
        ) : (
          <Typography color="text.secondary" mb={4}>
            No Upcoming Events.
          </Typography>
        )}

        <Typography variant="h5" gutterBottom>
          Past Events
        </Typography>
        {past.length ? (
          <Grid container spacing={3}>
            {past.map(renderEventCard)}
          </Grid>
        ) : (
          <Typography color="text.secondary">No Past Events.</Typography>
        )}
        <Typography variant="h5" gutterBottom>
          Requested Venues
        </Typography>
        {requestedVenues.length ? (
          <Grid container spacing={3} mb={4}>
            {requestedVenues.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.venue_id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Chip
                      label="Waiting For Approval"
                      color="warning"
                      sx={{ fontSize: "1rem", fontWeight: "bold", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {v.venue_name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      City: {v.city}
                    </Typography>
                    <Typography variant="body2">
                      Description: {v.venue_description || "Açıklama yok"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary" mb={4}>
            No requested venue
          </Typography>
        )}
      </Container>
    </>
  );
};

export default OrganizerDashboard;
