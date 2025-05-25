import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORY_COLORS = { 1: "#E2E8F0", 2: "#C3DAFE", 3: "#E9D8FD" };

export default function ConfigureSeating() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [venueMap, setVenueMap] = useState([]);
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState({
    default_ticket_price: "",
    vip_ticket_price: "",
    premium_ticket_price: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const eventData = state?.eventData;
  const images = state?.images || [];

  useEffect(() => {
    if (!eventData?.venue_id) return;
    fetch(`http://localhost:8080/api/venues/${eventData.venue_id}`)
      .then((res) => res.json())
      .then((data) => {
        setVenueMap(data.seat_map);
        setSeatMap(
          data.seat_map.map((row) => row.map((val) => (val === 1 ? 1 : 0)))
        );
        setLoading(false);
      });
  }, [eventData]);

  const handleSeatClick = (r, c) => {
    setSeatMap((prev) => {
      const updated = [...prev];
      if (venueMap[r][c] !== 1) return updated;
      updated[r][c] = updated[r][c] === 3 ? 1 : updated[r][c] + 1;
      return updated;
    });
  };
  const handleSubmit = async () => {
    if (submitting) return; // prevent double click
    setSubmitting(true);

    try {
      const payload = {
        ...eventData,
        seat_type_map: seatMap,
        ...Object.fromEntries(
          Object.entries(prices).map(([k, v]) => [k, parseFloat(v)])
        ),
      };

      const res = await fetch("http://localhost:8080/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const resData = await res.json();
      const event_id = resData.event_id;

      for (const img of images) {
        const imgPayload = new FormData();
        imgPayload.append("image", img);

        const imgRes = await fetch(
          `http://localhost:8080/api/images/${event_id}`,
          {
            method: "POST",
            body: imgPayload,
          }
        );

        if (!imgRes.ok) throw new Error(await imgRes.text());
      }

      localStorage.removeItem("draftEvent");
      setSnackbar({ open: true, message: "Etkinlik başarıyla oluşturuldu." });
      setTimeout(() => navigate("/organizer/events"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: "Hata: " + err.message });
    } finally {
      setSubmitting(false);
    }
  };
  if (loading)
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Seating & Pricing
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Default Price"
            type="number"
            required
            value={prices.default_ticket_price}
            onChange={(e) =>
              setPrices((p) => ({ ...p, default_ticket_price: e.target.value }))
            }
          />
          <TextField
            label="VIP Price"
            type="number"
            required
            value={prices.vip_ticket_price}
            onChange={(e) =>
              setPrices((p) => ({ ...p, vip_ticket_price: e.target.value }))
            }
          />
          <TextField
            label="Premium Price"
            required
            type="number"
            value={prices.premium_ticket_price}
            onChange={(e) =>
              setPrices((p) => ({ ...p, premium_ticket_price: e.target.value }))
            }
          />
        </Stack>
      </Paper>
      <Paper sx={{ p: 3 }}>
        {/* Legend Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Legend
          </Typography>
          <Stack direction="row" spacing={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: CATEGORY_COLORS[1],
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2">Default Seat</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: CATEGORY_COLORS[2],
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2">VIP Seat</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: CATEGORY_COLORS[3],
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2">Premium Seat</Typography>
            </Box>
          </Stack>
        </Box>
        <Grid container direction="column" spacing={1}>
          {seatMap.map((row, r) => (
            <Grid container item spacing={1} key={r}>
              {row.map((val, c) => (
                <Grid item key={c}>
                  <Box
                    onClick={() => handleSeatClick(r, c)}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: CATEGORY_COLORS[val] || "#aaa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      cursor: venueMap[r][c] === 1 ? "pointer" : "not-allowed",
                      opacity: venueMap[r][c] === 1 ? 1 : 0.3,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {val > 0 ? val : ""}
                  </Box>
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
        <Box textAlign="right" mt={4}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity="info">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
