import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VenueRequest() {
  const navigate = useNavigate();

  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [venue_description, setDescription] = useState("");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    /* simple validation before navigating */
    if (
      !venueName.trim() ||
      !city.trim() ||
      !location.trim() ||
      !venue_description.trim()
    ) {
      return setError("Please fill every required field.");
    }
    if (rows < 1 || rows > 100 || cols < 1 || cols > 100) {
      return setError("Rows and columns must be between 1 and 100.");
    }
    setError("");

    navigate("/organizer/venues/request/seatmap", {
      state: { venueName, city, location, venue_description, rows, cols },
    });
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" gutterBottom align="center">
          Venue Request
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Venue Name"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            required
            fullWidth
          />
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            inputProps={{ maxLength: 50 }}
            required
            fullWidth
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            inputProps={{ maxLength: 100 }}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={venue_description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ maxLength: 300 }}
            multiline
            rows={3}
            required
            fullWidth
          />
          <TextField
            label="Row Number"
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            inputProps={{ min: 1, max: 50 }}
            required
            fullWidth
          />
          <TextField
            label="Column Number"
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            inputProps={{ min: 1, max: 50 }}
            required
            fullWidth
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box textAlign="right">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Continue
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
