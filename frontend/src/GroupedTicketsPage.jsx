import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Paper, Box } from "@mui/material";
import apiService from "./apiService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function GroupedTicketsPage() {
  const query = useQuery();
  const eventId = query.get("event_id");
  const attendeeId = query.get("attendee_id");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (eventId && attendeeId) {
      apiService
        .getTickets({ event_id: eventId, attendee_id: attendeeId })
        .then((tickets) => setTickets(tickets))
        .catch((err) => console.error("Error fetching grouped tickets:", err));
    }
  }, [eventId, attendeeId]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tickets for Event #{eventId}
      </Typography>
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
  );
}
