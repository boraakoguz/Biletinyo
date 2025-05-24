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
    event_time: "",
    category: "",
    regulations: "",
    organizer_id: "",
    venue_id: "",
    seat_map: [[]],
    images: [],
  });
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

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
  useEffect(() => {
    console.log("Updated formData:", formData);
  }, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "venue_id") {
      const venueId = parseInt(value, 10);
      const selectedVenue = venues.find((v) => v.venue_id === venueId);
      console.log("Selected: ", selectedVenue);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        seat_map: selectedVenue?.seat_map || [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    console.log("Form: ", formData);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type === "image/png");

    if (validFiles.length !== files.length) {
      setError("Sadece PNG formatı kabul edilir.");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setFormData((p) => ({
      ...p,
      images: [...(p.images || []), ...validFiles],
    }));
    setError(null);
  };

  const handleContinue = () => {
    const draftEvent = {
      ...formData,
      event_status: 1,
      revenue: 0.0,
      default_ticket_price: 0.0,
      vip_ticket_price: 0.0,
      premium_ticket_price: 0.0,
      seat_type_map: formData.seat_map || [[0]],
    };

    navigate("/organizer/events/configure-seating", {
      state: {
        eventData: draftEvent,
        images: images,
        venue_id: formData.venue_id,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const eventPayload = {
        event_title: formData.event_title,
        description: formData.description,
        event_date: new Date(formData.event_date).toISOString(),
        event_time: formData.event_time || "00:00:00",
        category: formData.category,
        regulations: formData.regulations,
        event_status: 1,
        organizer_id: parseInt(formData.organizer_id, 10),
        venue_id: parseInt(formData.venue_id, 10),
        revenue: 0.0,
        seat_type_map: [[1]],
        default_ticket_price: 0.0,
        vip_ticket_price: 0.0,
        premium_ticket_price: 0.0,
      };
      console.log(eventPayload);

      const res = await fetch("http://localhost:8080/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      if (!res.ok) throw new Error(await res.text());
      const resData = await res.json();
      const event_id = resData.event_id;

      for (const img of formData.images) {
        const imgPayload = new FormData();
        imgPayload.append("image", img);

        const imgRes = await fetch(
          `http://localhost:8080/api/images/${event_id}`,
          {
            method: "POST",
            body: imgPayload,
          }
        );

        if (!imgRes.ok) {
          console.error("Image upload failed for", img.name);
          throw new Error(await imgRes.text());
        }
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
          Create a New Event
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
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Saat"
                value={formData.hour || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hour: e.target.value,
                    event_time: `${e.target.value}:${prev.minute || "00"}:00`,
                  }))
                }
                fullWidth
              >
                {hourOptions.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Dakika"
                value={formData.minute || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minute: e.target.value,
                    event_time: `${prev.hour || "00"}:${e.target.value}:00`,
                  }))
                }
                fullWidth
              >
                {minuteOptions.map((minute) => (
                  <MenuItem key={minute} value={minute}>
                    {minute}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
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
            <Box textAlign="right" mt={1}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/organizer/venues/request")}
              >
                Can't find the venue? Request!
              </Button>
            </Box>
            <Box>
              <InputLabel sx={{ mb: 1 }}>Upload Image* (PNG)</InputLabel>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ justifyContent: "flex-start" }}
              >
                {images.length > 0
                  ? `${images.length} dosya seçildi`
                  : "Dosya seç"}
                <input
                  hidden
                  type="file"
                  accept="image/png"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              {images.length > 0 && (
                <Box mt={1}>
                  <Typography variant="subtitle2">
                    Yüklenen Görseller:
                  </Typography>
                  <Stack spacing={1}>
                    {images.map((img, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          p: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`preview-${idx}`}
                            style={{
                              width: 80,
                              height: "auto",
                              borderRadius: 4,
                            }}
                          />
                          <Typography variant="body2">{img.name}</Typography>
                        </Box>
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const updated = [...images];
                            updated.splice(idx, 1);
                            setImages(updated);
                            setFormData((prev) => ({
                              ...prev,
                              images: updated,
                            }));
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
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
                Cancel
              </Button>
              <Button variant="contained" onClick={handleContinue}>
                Continue
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
