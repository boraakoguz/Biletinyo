import "./main-header.css";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, Button, Divider } from "@mui/material";
import apiService from "./apiService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function GroupedTicketsPage() {
  const navigate = useNavigate();
  const query = useQuery();
  const eventId = query.get("event_id");
  const attendeeId = query.get("attendee_id");
  const [tickets, setTickets] = useState([]);
  const [eventInfo, setEventInfo] = useState(null);

  useEffect(() => {
    if (eventId && attendeeId) {
      apiService
        .getTickets({ event_id: eventId, attendee_id: attendeeId })
        .then((tickets) => setTickets(tickets))
        .catch((err) => console.error("Error fetching grouped tickets:", err));
    }
  }, [eventId, attendeeId]);

  useEffect(() => {
    if (eventId) {
      apiService
        .getEventById(eventId)
        .then((data) => setEventInfo(data))
        .catch((err) => console.error("Error fetching event info:", err));
    }
  }, [eventId]);

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
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            width: "100%",
            maxWidth: 1000,
            px: 6,
          }}
        >
          <a href="/" className={"header-main"}>Biletinyo</a>
          <Button color="inherit" onClick={() => navigate(-1)} sx={{ color: "white" }}>
            Back
          </Button>
        </Box>
      </Box>
      <Box sx={{ bgcolor: "#fafafa" }}>
        <Divider />
      </Box>
      <Box sx={{ position: 'relative' }}>
        {tickets[0]?.qr_code && (
          <Box
            component="img"
            src={`data:image/png;base64,${tickets[0].qr_code}`}
            alt="QR Code"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 150,
              height: 150,
            }}
          />
        )}
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {eventInfo ? eventInfo.event_title : `Event #${eventId}`}
          </Typography>
          {eventInfo && (
            <Box sx={{ mb: 3 }}>
              <Typography><strong>Date:</strong> {eventInfo.event_date} at {eventInfo.event_time}</Typography>
              <Typography><strong>Location:</strong> {eventInfo.location}, {eventInfo.city}</Typography>
              <Typography><strong>Venue:</strong> {eventInfo.venue_name}</Typography>
              <Typography><strong>Category:</strong> {eventInfo.category}</Typography>
              {eventInfo.regulations && (
                <Typography><strong>Rules:</strong> {eventInfo.regulations}</Typography>
              )}
              {eventInfo.description && (
                <Typography><strong>Description:</strong> {eventInfo.description}</Typography>
              )}
            </Box>
          )}
          {tickets.map((t) => (
            <Paper key={t.ticket_id} sx={{ p: 2, mb: 2 }}>
              <Typography><strong>Ticket ID:</strong> {t.ticket_id}</Typography>
              <Typography><strong>Guest:</strong> {t.ticket_guest[0]?.guest_name || "—"}</Typography>
              <Typography><strong>Seat:</strong> Row {t.seat_row}, Col {t.seat_column}</Typography>
              <Typography><strong>Price:</strong> ${t.price}</Typography>
              <Typography><strong>Status:</strong> {t.ticket_state === 1 ? "Active" : "Cancelled"}</Typography>
            </Paper>
          ))}
        </Container>
      </Box>
    </>
  );
}
