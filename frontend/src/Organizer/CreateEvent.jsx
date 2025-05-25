import React, { useState, useEffect, useRef } from "react";
import apiService from "../apiService";
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
  const categoryOptions = [
    "Concert",
    "Theatre",
    "Festival",
    "Cinema",
    "Music",
    "Technology",
  ];

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

  useEffect(() => {
    const savedDraft = localStorage.getItem("draftEvent");
    const savedImageMeta = localStorage.getItem("draftImages");

    if (savedDraft) {
      const parsed = JSON.parse(savedDraft);
      setFormData((prev) => ({
        ...prev,
        ...parsed,
      }));
    }

    if (savedImageMeta) {
      const parsedMeta = JSON.parse(savedImageMeta);
      if (parsedMeta.length > 0) {
        setError("Images should be re-uploaded!");
      }
    }
  }, []);

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
        const data = await apiService.getAvailableVenues();
        setVenues(data);
      } catch (err) {
        console.error(err);
        setError("Error occured when loading venues.");
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
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f) => f.type === "image/png");

    if (validFiles.length !== files.length) {
      setError("Only PNG files are accepted");
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setFormData((p) => ({
      ...p,
      images: [...(p.images || []), ...validFiles],
    }));
    setError(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setToday(d.toISOString().split("T")[0]);
  }, []);
  const validateForm = () => {
    const fieldLabels = {
      event_title: "Event Title",
      description: "Description",
      event_date: "Date",
      event_time: "Clock",
      category: "Category",
      venue_id: "Venue",
      organizer_id: "Organizer",
    };

    const requiredFields = Object.keys(fieldLabels);

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `Please fill "${fieldLabels[field]}".`;
      }
    }

    const selectedDate = new Date(formData.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Event date cannot be in the past.";
    }

    if (images.length === 0) {
      return "At least one PNG must be uploaded";
    }

    return null;
  };

  const handleContinue = () => {
    setError(null);
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    const draftEvent = {
      ...formData,
      event_status: 1,
      revenue: 0.0,
      default_ticket_price: 0.0,
      vip_ticket_price: 0.0,
      premium_ticket_price: 0.0,
      seat_type_map: formData.seat_map || [[0]],
    };

    localStorage.setItem("draftEvent", JSON.stringify(draftEvent));

    navigate("/organizer/events/configure-seating", {
      state: {
        eventData: draftEvent,
        images: images,
        venue_id: formData.venue_id,
      },
    });
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
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create a New Event
        </Typography>
        <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
          <Stack spacing={3}>
            <TextField
              label="Event Title"
              name="event_title"
              inputProps={{ maxLength: 100 }}
              value={formData.event_title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              inputProps={{ maxLength: 500 }}
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Date"
              name="event_date"
              type="date"
              value={formData.event_date}
              onChange={handleChange}
              inputProps={{ min: today }}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Hour"
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
                label="Minute"
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
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Regulations"
              name="regulations"
              inputProps={{ maxLength: 300 }}
              value={formData.regulations}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              select
              label="Select Venue"
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
                  ? `${images.length} File Selected`
                  : "Choose File"}
                <input
                  hidden
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              {images.length > 0 && (
                <Box mt={1}>
                  <Typography variant="subtitle2">Uploaded Images:</Typography>
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
