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
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

  const handleSubmit = () => {
    navigate("/organizer/venues/request/seatmap", {
      state: { venueName, city, rows, cols },
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
            fullWidth
            required
          />
          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Row Number"
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Column Number"
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            fullWidth
          />
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
