import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [method, setMethod] = useState("Wallet");
  const [amount, setAmount] = useState("");

  const eventId = localStorage.getItem("event_id");
  const selectedTicketIds = JSON.parse(localStorage.getItem("selected_ticket_ids")) || [];
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        const b = data?.attendee?.account_balance;
        if (b != null) setBalance(b);
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!eventId) return;
    Promise.all([
      fetch(`http://localhost:8080/api/events/${eventId}`).then((r) => r.json()),
      Promise.all(
        selectedTicketIds.map((id) =>
          fetch(`http://localhost:8080/api/tickets/${id}`).then((r) => r.json())
        )
      ),
    ])
      .then(([ev, tk]) => {
        setEvent(ev);
        setTickets(tk);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId, selectedTicketIds]);

  const totalPrice = tickets.reduce((s, t) => s + (t.price || 0), 0);
  const seatNames = (JSON.parse(localStorage.getItem("selected_ticket_names")) || []).join(", ");

  const handleAmountChange = (e) => {
    const v = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(v)) setAmount(v);
  };

  const handleLoadBalance = async () => {
    if (!userId || !amount) return;
    const newB = (parseFloat(balance) || 0) + parseFloat(amount);
    await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_balance: newB }),
    });
    setBalance(newB);
    setAmount("");
  };

  const handlePurchase = async () => {
    if (method === "Wallet" && balance < totalPrice) return;
    const guests = JSON.parse(localStorage.getItem("guest_info")) || [];
    for (let i = 0; i < selectedTicketIds.length; i++) {
      const ticketId = selectedTicketIds[i];
      const body = {
        user_id: userId,
        payment_method: method === "Wallet" ? 0 : 1,
        guest_info: {
          guest_name: guests[i]?.name,
          guest_mail: guests[i]?.mail,
          guest_phone: guests[i]?.contact,
          guest_birth_date: guests[i]?.birth_date,
        },
      };

      const res = await fetch(
        `http://localhost:8080/api/tickets/${ticketId}/sell`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error("Sell error:", data);
        return;
      }
    }

    if (method === "Wallet") {
      const newB = balance - totalPrice;
      await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_balance: newB }),
      });
      setBalance(newB);
    }

    navigate("/");
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
        <Typography color="error">Etkinlik bulunamadı.</Typography>
      </Box>
    );
  }

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
          sx={{ textDecoration: "underline", fontWeight: "bold", fontStyle: "italic" }}
        >
          Biletinyo
        </Typography>
      </Box>

      <Box sx={{ p: 3, mt: 8, display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "100%", maxWidth: 1100, minHeight: 450, p: 4, boxShadow: 5 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              {event.event_title}
            </Typography>
            <Stack direction="row" spacing={2} divider={<span>•</span>}>
              <Typography>{event.event_time}</Typography>
              <Typography>{event.event_date}</Typography>
              <Typography>{event.venue_name}</Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Card sx={{ flex: 1, p: 3, border: "1px solid", borderColor: "grey.300" }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Your Payment
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Ticket Seats ({tickets.length}): {seatNames}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Total Price: {totalPrice.toFixed(2)} TL
              </Typography>
            </Card>

            <Card sx={{ flex: 1, p: 3, border: "1px solid", borderColor: "grey.300" }}>
              <Stack spacing={2}>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                  {balance != null
                    ? `Your account balance: ${balance.toFixed(2)} TL`
                    : "Loading account balance..."}
                </Typography>

                <Typography fontWeight={700}>Current Payment Method</Typography>
                <Select
                  size="small"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Wallet">Wallet</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                </Select>

                <Typography fontWeight={700}>Load Amount</Typography>
                <TextField
                  placeholder="TL"
                  size="small"
                  fullWidth
                  value={amount}
                  onChange={handleAmountChange}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleLoadBalance}
                  disabled={!amount}
                >
                  Load
                </Button>
              </Stack>
            </Card>
          </Stack>
          {method === "Wallet" && balance < totalPrice && (
            <Typography color="error" sx={{ mt: 1 }}>
              Your account balance is insufficient.
            </Typography>
            )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button variant="contained" size="large" onClick={handlePurchase}>
              Confirm Payment
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}
