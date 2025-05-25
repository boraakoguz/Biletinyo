import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Container,
  Paper,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../apiService";

export default function TicketCategoryEdit() {
  const navigate = useNavigate();
  const location = useLocation();

  const [prices, setPrices] = useState({
    cat1: "",
    cat2: "",
    cat3: "",
  });

  /** fetch current ticket prices for the event */
  useEffect(() => {
    const eventId = location.state?.event_id;
    if (!eventId) return;

    (async () => {
      try {
        const evt = await apiService.getEventById(eventId);
        setPrices({
          cat1: evt.default_ticket_price,
          cat2: evt.vip_ticket_price,
          cat3: evt.premium_ticket_price,
        });
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    })();
  }, [location]);

  /** save updated prices */
  const handleSave = async () => {
    const eventId = location.state?.event_id;
    try {
      await apiService.updateEventPrices(eventId, prices);
      alert("Prices updated successfully!");
      navigate("/organizer/events", { replace: true });
    } catch (err) {
      console.error("Failed to update prices:", err);
      alert("Failed to update prices.");
    }
  };

  return (
    <>
      {/* HEADER */}
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
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/organizer/dashboard")}
          >
            Back
          </Button>
        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Set Ticket Prices
        </Typography>

        <Paper sx={{ p: 2, mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              label="Standard Price"
              type="number"
              value={prices.cat1}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat1: e.target.value }))
              }
            />
            <TextField
              label="VIP Price"
              type="number"
              value={prices.cat2}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat2: e.target.value }))
              }
            />
            <TextField
              label="Premium Price"
              type="number"
              value={prices.cat3}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat3: e.target.value }))
              }
            />
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
