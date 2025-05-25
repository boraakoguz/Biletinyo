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
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VenueManagement() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock API
    setTimeout(() => {
      setVenues([
        { venue_id: 1, venue_name: "Bilkent Konser Salonu", city: "Ankara" },
        { venue_id: 2, venue_name: "City Park Açık Hava", city: "İstanbul" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = venues.filter(
    (v) =>
      v.venue_name.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* GLOBAL HEADER */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Mekan ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" } }}
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
          </Stack>
        </Toolbar>
      </AppBar>

      {/* İÇERİK */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Mekan & Koltuk Yönetimi
        </Typography>

        {/* Mekan Listesi */}
        <Grid container spacing={3} mb={4}>
          {filtered.map((venue) => (
            <Grid item xs={12} sm={6} md={4} key={venue.venue_id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">{venue.venue_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {venue.city}
                  </Typography>
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
                      navigate(`/organizer/venues/${venue.venue_id}/seating`)
                    }
                  >
                    Oturma Planı
                  </Button>
                  <Button size="small" color="error" variant="outlined">
                    Sil
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
          {/* Yeni Mekan Ekle Kartı */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: 3,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                cursor: "pointer",
              }}
              onClick={() => navigate("/organizer/venues/new")}
            >
              <Typography variant="h6" color="primary">
                + Yeni Mekan Ekle
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
