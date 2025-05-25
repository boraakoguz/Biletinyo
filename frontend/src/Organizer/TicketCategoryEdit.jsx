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
  Grid,
  Card,
  CardContent,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useLocation } from "react-router-dom";
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";

export default function TicketCategoryEdit() {
  const COLORS = ["#e57373", "#64b5f6", "#81c784"];

  const navigate = useNavigate();
  const [assignments, setAssignments] = useState({});
  const [prices, setPrices] = useState({
    cat1: "",
    cat2: "",
    cat3: "",
  });

  const location = useLocation();

  useEffect(() => {
    const eventId = location.state?.event_id;
    if (!eventId) return;

    const fetchPrices = async () => {
      try {
        const event = await apiService.getEventById(eventId);
        const newPrices = {
          cat1: event.default_ticket_price,
          cat2: event.vip_ticket_price,
          cat3: event.premium_ticket_price,
        };
        setPrices(newPrices);
        console.log("Fetched ticket prices:", newPrices); // 👈 logs immediately
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };

    fetchPrices();
  }, [location]);

  const categories = [
    { name: "Default", color: COLORS[0] },
    { name: "VIP", color: COLORS[1] },
    { name: "Premium", color: COLORS[2] },
  ];

  const [selectedCat, setSelectedCat] = useState(categories[0].name);

  const rows = 10;
  const cols = 10;

  const toggleSeat = (row, col) => {
    const key = `${row}-${col}`;
    setAssignments((prev) => ({
      ...prev,
      [key]: prev[key] === selectedCat ? null : selectedCat,
    }));
  };

  const handleSave = async () => {
    const eventId = location.state?.event_id;

    try {
      await apiService.updateEventPrices(eventId, prices);
      alert("Prices updated successfully!");
    } catch (err) {
      console.error("Failed to update prices:", err);
      alert("Failed to update prices.");
    }
  };
  return (
    <>
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
