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
  InputLabel,
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
    image: null,
  });
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [imgName, setImgName] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    if (user && user.user_type === 1) {
      setFormData((prev) => ({ ...prev, organizer_id: user.id }));
    }
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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "image/png") {
        setError("Sadece PNG formatı kabul edilir.");
        return;
      }
      setFormData((p) => ({ ...p, image: file }));
      setImgName(file.name);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("event_title", formData.event_title);
      payload.append("description", formData.description);
      payload.append("event_date", new Date(formData.event_date).toISOString());
      payload.append("category", formData.category);
      payload.append("regulations", formData.regulations);
      payload.append("event_status", 1);
      payload.append("organizer_id", parseInt(formData.organizer_id, 10));
      payload.append("venue_id", parseInt(formData.venue_id, 10));
      if (formData.image) payload.append("image", formData.image);

      const res = await fetch("http://localhost:8080/api/events/", {
        method: "POST",
        body: payload,
      });
      if (!res.ok) throw new Error(await res.text());

      // Test if it works, cant test now
      const { event_id } = await createRes.json();
      if (formData.image) {
        const imgPayload = new FormData();
        imgPayload.append("image", formData.image);

        const imgRes = await fetch(
          `http://localhost:8080/api/events/${event_id}`,
          {
            method: "POST",
            body: imgPayload,
          }
        );
        if (!imgRes.ok) throw new Error(await imgRes.text());
      }

      alert("Etkinlik başarıyla oluşturuldu!");
      navigate("/organizer/events");
    } catch (err) {
      console.error(err);
      setError("Etkinlik oluşturma hatası: " + err.message);
    }
  };

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

      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
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
            <Box>
              <InputLabel sx={{ mb: 1 }}>Tanıtım Görseli (PNG)</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {imgName || "Dosya seç"}
                <input
                  hidden
                  type="file"
                  accept="image/png"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
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
