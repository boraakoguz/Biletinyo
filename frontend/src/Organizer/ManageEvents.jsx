// frontend/src/Organizer/ManageEvents.jsx

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
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // ─── Mock API çağrısı ───
    setTimeout(() => {
      setEvents([
        {
          event_id: 1,
          event_title: "Rock Concert – Duman",
          event_date: "2025-05-02T20:00",
          venue_name: "Main Hall",
          location: "Congresium, Ankara",
          tickets_sold: 120,
          capacity: 200
        },
        {
          event_id: 2,
          event_title: "Ajda Pekkan Open-Air",
          event_date: "2025-06-20T21:00",
          venue_name: "Open-Air Stage",
          location: "City Park, İstanbul",
          tickets_sold: 80,
          capacity: 100
        },
        {
          event_id: 3,
          event_title: "Jazz Night Live",
          event_date: "2025-07-10T19:30",
          venue_name: "City Jazz Club",
          location: "Beyoğlu, İstanbul",
          tickets_sold: 45,
          capacity: 50
        },
        {
          event_id: 4,
          event_title: "Tech Meetup",
          event_date: "2025-08-05T18:00",
          venue_name: "Convention Center",
          location: "Alsancak, İzmir",
          tickets_sold: 30,
          capacity: 50
        },
        {
          event_id: 5,
          event_title: "Art Exhibition Opening",
          event_date: "2025-09-12T17:00",
          venue_name: "Gallery 21",
          location: "Çankaya, Ankara",
          tickets_sold: 10,
          capacity: 30
        },
        {
          event_id: 6,
          event_title: "Stand-Up Comedy Night",
          event_date: "2025-10-01T20:00",
          venue_name: "Laugh Factory",
          location: "Kadıköy, İstanbul",
          tickets_sold: 25,
          capacity: 40
        },
      ]);
      setLoading(false);
    }, 500);
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
                      label={`${evt.tickets_sold} / ${evt.capacity} doluluk`}
                      size="small"
                      color={evt.tickets_sold / evt.capacity > 0.8 ? "error" : "primary"}
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
