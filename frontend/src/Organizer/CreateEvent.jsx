import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
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
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/venues");
        const data = await res.json();
        setVenues(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load venues.");
      }
    };

    fetchVenues();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        organizer_id: parseInt(formData.organizer_id),
        venue_id: parseInt(formData.venue_id),
        revenue: parseFloat(formData.revenue || 0.0),
      };

      console.log("Sending event payload:", payload);

      const res = await fetch("http://localhost:8080/api/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      alert("Event created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Create event error:", err);
      setError("Event creation failed: " + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Create New Event
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Event Title"
          name="event_title"
          value={formData.event_title}
          onChange={handleChange}
          required
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
        />

        <TextField
          label="Date"
          name="event_date"
          type="date"
          value={formData.event_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <TextField
          label="Regulations"
          name="regulations"
          value={formData.regulations}
          onChange={handleChange}
          multiline
          rows={2}
        />

        <TextField
          label="Organizer ID"
          name="organizer_id"
          value={formData.organizer_id}
          onChange={handleChange}
          required
        />

        <TextField
          select
          label="Venue"
          name="venue_id"
          value={formData.venue_id}
          onChange={handleChange}
          required
        >
          {venues.map((v) => (
            <MenuItem key={v.venue_id} value={v.venue_id}>
              {v.venue_name} - {v.city}
            </MenuItem>
          ))}
        </TextField>

        {error && <Typography color="error">{error}</Typography>}

        <Button variant="contained" onClick={handleSubmit}>
          Create Event
        </Button>
      </Stack>
    </Box>
  );
}

export default CreateEvent;
