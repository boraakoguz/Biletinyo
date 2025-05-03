import React from "react";
import { Box, Typography, Paper, Button, Stack } from "@mui/material";

const tickets = [
  {
    guest: "Ege Ertem",
    email: "ege@gmail.com",
    phone: "+905300012334",
  },
  {
    guest: "Bora Akoğuz",
    email: "bora@gmail.com",
    phone: "+905303312334",
  },
  {
    guest: "Can Kütükoğlu",
    email: "can@gmail.com",
    phone: "+905300014534",
  },
];

function TicketPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Gate 12 Seats: A10, A11, A12
      </Typography>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          py: 2,
        }}
      >
        {tickets.map((ticket, index) => (
          <Paper
            key={index}
            sx={{
              minWidth: "300px",
              width: "30%",
              minHeight: "80vh",
              p: 3,
              flexShrink: 0,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <img
                src="/assets/qr-placeholder.png"
                alt="QR Code"
                style={{ width: 200, height: 200 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Event Name: Rock Concert
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Location: Congresium
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: 27.03.2025
              </Typography>
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Guest {index + 1}
              </Typography>
              <Typography variant="subtitle1">Name: {ticket.guest}</Typography>
              <Typography variant="subtitle1">Email: {ticket.email}</Typography>
              <Typography variant="subtitle1">Phone: {ticket.phone}</Typography>
            </Box>

            <Button variant="contained">Download PDF</Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default TicketPage;
