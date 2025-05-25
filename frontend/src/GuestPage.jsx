import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

function GuestPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestData, setGuestData] = useState([]);

  const eventId = localStorage.getItem("event_id");
  const selectedTicketIds = JSON.parse(localStorage.getItem("selected_ticket_ids")) || [];
  const selectedTicketNames = JSON.parse(localStorage.getItem("selected_ticket_names")) || [];

  useEffect(() => {
    if (!eventId) return;

    fetch(`http://localhost:8080/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setGuestData(
          selectedTicketIds.map(() => ({
            name: "",
            mail: "",
            contact: "",
            birth_date: "",
          }))
        );
        setLoading(false);
      });
  }, [eventId]);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (index, field, value) => {
    setGuestData((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleContinue = () => {
    localStorage.setItem("guest_info", JSON.stringify(guestData));
    navigate(`/event/${eventId}/payment`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography color="error">Could not find event.</Typography>
      </Box>
    );
  }

  const forms = selectedTicketIds.map((_, i) => (
    <Card
      key={i}
      sx={{
        minWidth: 260,
        p: 2,
        border: "1px solid",
        borderColor: "grey.300",
        boxShadow: 3,
        flexShrink: 0,
      }}
    >
      <Typography textAlign="center" fontWeight={700} mb={1}>
        Guest {i + 1} - {selectedTicketNames[i] || "?"}
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Name"
          size="small"
          fullWidth
          value={guestData[i]?.name || ""}
          onChange={(e) => handleChange(i, "name", e.target.value)}
        />
        <TextField
          label="Mail"
          size="small"
          fullWidth
          value={guestData[i]?.mail || ""}
          onChange={(e) => handleChange(i, "mail", e.target.value)}
        />
        <TextField
          label="Contact Number"
          size="small"
          fullWidth
          value={guestData[i]?.contact || ""}
          onChange={(e) => handleChange(i, "contact", e.target.value)}
        />
        <TextField
          label="Birth Date"
          type="date"
          size="small"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ max: today }}
          value={guestData[i]?.birth_date || ""}
          onChange={(e) => handleChange(i, "birth_date", e.target.value)}
        />
      </Stack>
    </Card>
  ));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          boxShadow: 10,
          backgroundColor: "#002fa7",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textDecoration: "underline",
            fontWeight: "bold",
            fontStyle: "italic",
          }}
        >
          Biletinyo
        </Typography>
      </Box>

      <Box sx={{ p: 3, mt: 8, display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "100%", maxWidth: 1100, p: 4, boxShadow: 5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              {event.event_title}
            </Typography>
            <Stack direction="row" spacing={2} divider={<span>•</span>}>
              <Typography>{event.event_time}</Typography>
              <Typography>{event.event_date}</Typography>
              <Typography>{event.venue_name}</Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2, overflowX: "auto", pb: 1 }}>
            <Stack direction="row" spacing={3}>
              {forms}
            </Stack>
          </Box>

          <Typography sx={{ mt: 2 }}>
            Selected Tickets: {selectedTicketNames.join(", ")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={handleContinue}>
              Continue
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default GuestPage;
