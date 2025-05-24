import React, { useState } from "react";
import { Box, Container, Typography, Button, Paper, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function VenueSeatMap() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { venueName, city, rows, cols } = state || {};

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
    const venueData = {
      venue_name: venueName,
      city,
      seat_map: seatMap,
    };
    console.log("Submitting venue:", venueData);

    alert("Venue Requested!");
    navigate("/organizer/events");
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Seat Map for {venueName} ({city})
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Paper sx={{ p: 3, mt: 2, overflowX: "auto" }}>
          <Grid container direction="column" spacing={1}>
            {seatMap.map((row, rowIdx) => (
              <Grid
                container
                item
                key={rowIdx}
                spacing={1}
                justifyContent="center"
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
