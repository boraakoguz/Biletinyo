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

  return (
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
      <Typography variant="h5" mb={2}>
        Events
      </Typography>
      {events.length === 0 ? (
        <Typography>No upcoming events.</Typography>
      ) : (
        <Grid container spacing={3}>
          {events.map((ev) => (
            <Grid item key={ev.event_id}>
              <Card sx={{ width: 280 }}>
                <CardActionArea
                  onClick={() => navigate(`/event/${ev.event_id}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{ height: 150 }}
                    image={ev.image}
                  />
                  <CardContent>
                    <Typography fontWeight={600}>{ev.event_title}</Typography>

                    <Typography variant="body2" color="text.secondary">
                      {new Date(ev.event_date).toLocaleDateString()} •{" "}
                      {ev.venue_name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
