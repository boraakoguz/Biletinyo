import React, { useState } from "react";
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../apiService";

export default function AdminVenueSeatMap() {
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
      navigate("/");
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
        <Paper sx={{ p: 3, mt: 2, overflowX: "auto" }}>
          <Box sx={{ minWidth: cols * 45 }}>
            {" "}
            {/* ensures enough space */}
            <Grid container direction="column" spacing={1}>
              {seatMap.map((row, rowIdx) => (
                <Grid
                  container
                  item
                  key={rowIdx}
                  spacing={1}
                  wrap="nowrap" // prevents row from wrapping
                  alignItems="center"
                >
                  {row.map((seat, colIdx) => (
                    <Grid item key={`${rowIdx}-${colIdx}`}>
                      <Box
                        onClick={() => toggleSeat(rowIdx, colIdx)}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: seat === 1 ? "#1976d2" : "#ccc",
                          borderRadius: 1,
                          cursor: "pointer",
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
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
