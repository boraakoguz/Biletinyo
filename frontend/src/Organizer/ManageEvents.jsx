import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!userId) {
      console.error("No logged-in organizer found");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await apiService.getEventsByOrganizer(userId);

        const enriched = await Promise.all(
          data.map(async (evt) => {
            const [capacityData, occupiedData] = await Promise.all([
              apiService
                .getEventCapacityById(evt.event_id)
                .catch(() => ({ capacity: 0 })),
              apiService
                .getEventOccupiedSeatsById(evt.event_id)
                .catch(() => ({ occupied: 0 })),
            ]);

            return {
              ...evt,
              capacity: capacityData.capacity,
              occupied: occupiedData.occupied,
            };
          })
        );

        setEvents(enriched);
      } catch (err) {
        console.error("Failed to fetch organizer events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Ara filtrelemesi
  const filtered = events.filter(
    (e) =>
      e.event_title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* GLOBAL HEADER */}
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
              placeholder="Etkinlik veya lokasyon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": {
                  border: "none",
                },
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/organizer/events/new")}
          >
            + Yeni Etkinlik
          </Button>
        </Toolbar>
      </AppBar>

      {/* İÇERİK */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Etkinliklerim
        </Typography>

        <Grid container spacing={3}>
          {filtered.map((evt) => (
            <Grid item xs={12} sm={6} md={4} key={evt.event_id}>
              <Card sx={{ boxShadow: 3, position: "relative" }}>
                <CardContent>
                  <Typography variant="h6">{evt.event_title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(evt.event_date).toLocaleString("tr-TR")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {evt.venue_name}, {evt.location}
                  </Typography>

                  {/* Doluluk oranı göstergesi */}
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`${evt.occupied} / ${evt.capacity} doluluk`}
                      size="small"
                      color={
                        evt.capacity > 0 && evt.occupied / evt.capacity > 0.8
                          ? "error"
                          : "primary"
                      }
                    />
                  </Box>
                </CardContent>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() =>
                      navigate(`/organizer/events/${evt.event_id}`)
                    }
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
              </Card>
            </Grid>
          ))}

          {filtered.length === 0 && (
            <Typography color="text.secondary" sx={{ m: 4 }}>
              Gösterilecek etkinlik yok.
            </Typography>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default ManageEvents;
