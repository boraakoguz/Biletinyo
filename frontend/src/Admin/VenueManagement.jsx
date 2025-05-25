// src/Admin/VenueManagement.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Box, TextField, Stack, Button,
  Container, Grid, Card, CardContent, CircularProgress, Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminVenueManagement() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // mock API ↴
    setTimeout(() => {
      setVenues([
        { venue_id: 1, venue_name: "Bilkent Konser Salonu", city: "Ankara", status: "active", creator: "admin" },
        { venue_id: 2, venue_name: "City Park Açık Hava", city: "İstanbul", status: "pending", creator: "organizer", organizerNote: "Geniş bir açık hava alanı" },
        { venue_id: 3, venue_name: "Moda Sahne", city: "İstanbul", status: "pending", creator: "organizer", organizerNote: "Kapasite: 300 kişi" },
        { venue_id: 4, venue_name: "Caddebostan Salon", city: "İstanbul", status: "active", creator: "admin" },
        { venue_id: 5, venue_name: "Ankara Spor Kompleksi", city: "Ankara", status: "pending", creator: "organizer", organizerNote: "Çim saha üstü tribün düzeni" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = venues.filter((v) =>
    v.venue_name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = (id) =>
    setVenues(venues.map(v => v.venue_id === id ? { ...v, status: "active" } : v));
  const handleReject = (id) =>
    setVenues(venues.filter(v => v.venue_id !== id));

  if (loading) {
    return <Box sx={{ mt: 10, textAlign: "center" }}><CircularProgress/></Box>;
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography variant="h5" sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>
            Biletinyo Admin
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth size="small" placeholder="Mekan ara..."
              value={search} onChange={e => setSearch(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 3, "& .MuiOutlinedInput-root fieldset": { border: "none" } }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="inherit" sx={{ borderColor: "white" }}
              onClick={() => navigate("/admin/venues/new")}>
              Yeni Mekan Oluştur
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>Venue Yönetimi</Typography>
        <Grid container spacing={3}>
          {filtered.map(v => (
            <Grid item xs={12} sm={6} md={4} key={v.venue_id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{v.venue_name}</Typography>
                    <Chip
                      label={v.status === "pending" ? "Bekliyor" : "Onaylandı"}
                      color={v.status === "pending" ? "warning" : "success"}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{v.city}</Typography>
                  {v.status === "pending" && v.organizerNote && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: "#f9f9f9", borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Organizer notu:</strong> {v.organizerNote}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                  {v.status === "pending" ? (
                    <>
                      <Button size="small" variant="contained" onClick={() => handleApprove(v.venue_id)}>Onayla</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => handleReject(v.venue_id)}>Reddet</Button>
                    </>
                  ) : (
                    <>
                      <Button size="small" variant="outlined" onClick={() => navigate(`/admin/venues/${v.venue_id}/edit`)}>Düzenle</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleReject(v.venue_id)}>Sil</Button>
                    </>
                  )}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
