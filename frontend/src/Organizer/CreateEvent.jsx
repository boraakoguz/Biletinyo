// frontend/src/Organizer/CreateEvent.jsx

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    event_title: "",
    description: "",
    event_date: "",
    category: "",
    regulations: "",
    organizer_id: "",
    venue_id: "",
  });
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock yerine gerçek API çağrısı
    (async () => {
      try {
        const res = await fetch("http://localhost:8080/api/venues");
        const data = await res.json();
        setVenues(data);
      } catch (err) {
        console.error(err);
        setError("Mekanlar yüklenirken hata oluştu.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        organizer_id: parseInt(formData.organizer_id, 10),
        venue_id: parseInt(formData.venue_id, 10),
        // backend tarih biçimi bekliyorsa ISO string'e çevir:
        event_date: new Date(formData.event_date).toISOString(),
      };

      const res = await fetch("http://localhost:8080/api/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // başarı mesajı ve listeye yönlendirme
      alert("Etkinlik başarıyla oluşturuldu!");
      navigate("/organizer/events");
    } catch (err) {
      console.error(err);
      setError("Etkinlik oluşturma hatası: " + err.message);
    }
  };

  return (
    <>
      {/* === GLOBAL HEADER === */}
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
              disabled
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

      {/* === FORM CONTENT === */}
      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Etkinlik Oluştur
        </Typography>

        <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
          <Stack spacing={3}>
            <TextField
              label="Etkinlik Başlığı"
              name="event_title"
              value={formData.event_title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Açıklama"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Tarih"
              name="event_date"
              type="date"
              value={formData.event_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <TextField
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Kurallar"
              name="regulations"
              value={formData.regulations}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />

            <TextField
              label="Organizatör ID"
              name="organizer_id"
              value={formData.organizer_id}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              select
              label="Mekan Seç"
              name="venue_id"
              value={formData.venue_id}
              onChange={handleChange}
              required
              fullWidth
            >
              {venues.map((v) => (
                <MenuItem key={v.venue_id} value={v.venue_id}>
                  {v.venue_name} – {v.city}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Box textAlign="right">
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => navigate("/organizer/events")}
              >
                İptal
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Oluştur
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
