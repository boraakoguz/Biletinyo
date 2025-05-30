import React, { useState } from "react";
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../apiService";

export default function VenueSeatMap() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { venueName, city, location, venue_description, rows, cols } =
    state || {};

  const [seatMap, setSeatMap] = useState(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => 1))
  );

  const toggleSeat = (r, c) => {
    setSeatMap((prev) => {
      const newMap = prev.map((row) => [...row]);
      newMap[r][c] = newMap[r][c] === 1 ? 0 : 1;
      return newMap;
    });
  };

  const handleSubmit = async () => {
    const capacity = seatMap.reduce(
      (sum, row) => sum + row.filter((seat) => seat === 1).length,
      0
    );

    const venueData = {
      venue_name: venueName,
      city,
      location,
      venue_description,
      capacity,
      seat_map: seatMap,
      available: 0,
    };

    try {
      await apiService.requestVenue(venueData);
      alert("Venue request submitted!");
      navigate("/organizer/events");
    } catch (err) {
      console.error("Error requesting venue:", err);
      alert("Venue request failed: " + err.message);
    }
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Seat Map for {venueName} ({city})
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "#1976d2",
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{ width: 20, height: 20, bgcolor: "#ccc", borderRadius: 1 }}
            />
            <Typography variant="body2">Unavailable</Typography>
          </Box>
        </Box>
        <Paper
          sx={{
            p: 3,
            mt: 2,
            maxHeight: 500,
            maxWidth: 1,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 40px)`,
              gridAutoRows: "40px",
              gap: 1,
              justifyContent: "center",
            }}
          >
            {seatMap.map((row, rIdx) =>
              row.map((seat, cIdx) => (
                <Box
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => toggleSeat(rIdx, cIdx)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: seat ? "#1976d2" : "#ccc",
                    borderRadius: 1,
                    cursor: "pointer",
                  }}
                />
              ))
            )}
          </Box>
        </Paper>

        <Box textAlign="right" mt={3}>
          <Button
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Request
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
