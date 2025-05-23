import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "./apiService";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
  CircularProgress,
  Button,
} from "@mui/material";

export default function OrganizerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleSignInRedirect = () => {
    navigate("/signin");
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleProfileRedirect = () => navigate("/profile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  useEffect(() => {
    (async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsLoggedIn(!!user);

        const detail = await apiService.getUserById(id);
        setOrg(detail);

        const evs = await apiService.getEventsByOrganizer(id);
        setEvents(evs);

        if (user) {
          const followRes = await apiService.isFollowing(user.id, id);
          setIsFollowing(followRes.following);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  // 🟦 Date comparison logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter(
    (ev) => new Date(ev.event_date).setHours(0, 0, 0, 0) >= today.getTime()
  );
  const past = events.filter(
    (ev) => new Date(ev.event_date).setHours(0, 0, 0, 0) < today.getTime()
  );

  const renderEventCard = (ev) => (
    <Grid item key={ev.event_id}>
      <Card sx={{ width: 280 }}>
        <CardActionArea onClick={() => navigate(`/event/${ev.event_id}`)}>
          <CardMedia component="img" sx={{ height: 150 }} image={ev.image} />
          <CardContent>
            <Typography fontWeight={600}>{ev.event_title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(ev.event_date).toLocaleDateString()} • {ev.venue_name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          boxShadow: 10,
          backgroundColor: "#002fa7",
          color: "white",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            width: "100%",
            maxWidth: 1000,
            px: 6,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textDecoration: "underline",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Biletinyo
          </Typography>

          <Stack direction="row" spacing={1}>
            {isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleProfileRedirect}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={handleLoginRedirect}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleSignInRedirect}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {org.organizer?.organization_name || org.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          {org.email} • {org.phone}
        </Typography>
        {isLoggedIn && (
          <Box sx={{ mb: 3 }}>
            <Button variant="outlined">
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </Box>
        )}

        {/* Upcoming Events */}
        <Typography variant="h5" mb={2}>
          Upcoming Events
        </Typography>
        {upcoming.length === 0 ? (
          <Typography>No upcoming events.</Typography>
        ) : (
          <Grid container spacing={3} mb={4}>
            {upcoming.map(renderEventCard)}
          </Grid>
        )}

        {/* Past Events */}
        <Typography variant="h5" mb={2}>
          Past Events
        </Typography>
        {past.length === 0 ? (
          <Typography>No past events.</Typography>
        ) : (
          <Grid container spacing={3}>
            {past.map(renderEventCard)}
          </Grid>
        )}
      </Container>
    </>
  );
}
