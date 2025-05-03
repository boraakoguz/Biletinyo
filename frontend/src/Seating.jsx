import React, { useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import armchair from "./assets/armchair.png";

function Seating() {
  const rows = 10;
  const columns = 10;
  const [selectedSeats, setSelectedSeats] = useState([]);

  function toRowLabel(n) {
    let label = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      label = String.fromCharCode(65 + rem) + label;
      n = Math.floor((n - 1) / 26);
    }
    return label;
  }

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Event Seating
        </Typography>
        {/* 👇 Event details */}
        <Typography variant="h6" gutterBottom>
          <strong>Event:</strong> Jazz Night Live
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Location:</strong> Bilkent Concert Hall
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Date:</strong> May 10, 2025 — 8:00 PM
        </Typography>

        <Grid container direction="column" spacing={1}>
          {[...Array(rows)].map((_, rowIdx) => (
            <Grid
              container
              item
              key={rowIdx}
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Box
                  sx={{
                    width: 30,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {toRowLabel(rowIdx + 1)}
                </Box>
              </Grid>

              {[...Array(columns)].map((_, colIdx) => {
                const seatId = `${rowIdx + 1}-${colIdx + 1}`;
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <Grid item key={seatId}>
                    <Box
                      onClick={() => toggleSeat(seatId)}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundImage: `url(${armchair})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        bgcolor: isSelected ? "green" : "#eee",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: isSelected ? "darkgreen" : "#ccc",
                        },
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          ))}

          <Grid container spacing={1} justifyContent="center" mt={2}>
            <Grid item>
              <Box sx={{ width: 30 }} />
            </Grid>
            {[...Array(columns)].map((_, colIdx) => (
              <Grid item key={`col-${colIdx}`}>
                <Box
                  sx={{
                    width: 40,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {colIdx + 1}
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Selected Seats:</Typography>
            <Typography variant="body1">
              {selectedSeats.length > 0
                ? selectedSeats
                    .map((seat) => {
                      const [row, col] = seat.split("-").map(Number);
                      return {
                        row,
                        col,
                        label: `${toRowLabel(row)}${col}`,
                      };
                    })
                    .sort((a, b) => {
                      if (a.row !== b.row) return a.row - b.row;
                      return a.col - b.col;
                    })
                    .map((seat) => seat.label)
                    .join(", ")
                : "None"}
            </Typography>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Seating;
