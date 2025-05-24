import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import armchair from "./assets/armchair.png";

const SEAT_COLORS = {
  1: "#90caf9", // Default
  2: "#a5d6a7", // VIP
  3: "#ce93d8", // Premium
  4: "#ef9a9a", // Occupied
};

function toRowLabel(n) {
  let label = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function Seating() {
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("event_id");
    const eventId = raw ? parseInt(raw) : null;

    if (!eventId) return;

    fetch(`http://localhost:8080/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setLoading(false);
      });
  }, []);

  const toggleSeat = (rowIdx, colIdx) => {
    const val = event.seat_type_map[rowIdx][colIdx];
    if (val === 4) return; // Don't allow interaction on occupied seats

    const seatId = `${rowIdx + 1}-${colIdx + 1}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  if (loading || !event) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: "relative" }}>
        <Typography variant="h4" gutterBottom>
          Event Seating
        </Typography>
        <Typography variant="h6" gutterBottom>
          <strong>Event:</strong> {event.event_title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Location:</strong> {event.location}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Date:</strong> {event.event_date} — {event.event_time}
        </Typography>

        <Grid container direction="column" spacing={1}>
          {event.seat_type_map.map((row, rowIdx) => (
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

              {row.map((val, colIdx) => {
                if (val === 0)
                  return (
                    <Box
                      key={`${rowIdx}-${colIdx}`}
                      sx={{ width: 40, height: 40 }}
                    />
                  );

                const seatId = `${rowIdx + 1}-${colIdx + 1}`;
                const isSelected = selectedSeats.includes(seatId);
                const isOccupied = val === 4;

                return (
                  <Grid item key={seatId}>
                    <Box
                      onClick={() => toggleSeat(rowIdx, colIdx)}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundImage: `url(${armchair})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        bgcolor: isSelected ? "green" : SEAT_COLORS[val],
                        borderRadius: 1,
                        cursor: isOccupied ? "not-allowed" : "pointer",
                        opacity: isOccupied ? 0.5 : 1,
                        "&:hover": {
                          bgcolor: isSelected
                            ? "darkgreen"
                            : isOccupied
                            ? SEAT_COLORS[val]
                            : "#ccc",
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
            {[...Array(event.seat_type_map[0].length)].map((_, colIdx) => (
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

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                // Implement here, to be continued...
              }}
            >
              Continue
            </Button>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Seating;
