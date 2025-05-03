import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event || {
    title: "Rock Concert Name 2",
    time: "19.00",
    date: "30.03.2025",
    location: "Ankara",
  };

  const seats = "B4, B5, B6";
  const ticketPrice = 5000;
  const ticketCount = 3;
  const totalPrice = ticketPrice * ticketCount;

  const [balance] = useState(2000);
  const [method, setMethod] = useState("VISA •••• 1234");
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [amount, setAmount] = useState("");

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
            width: "100%",
            maxWidth: 1000,
            px: 6,
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
          <Box sx={{ flexGrow: 1, mx: 5, minWidth: 200 }}>
            <TextField
              disabled
              size="small"
              fullWidth
              placeholder="Arama yapmak için bu sayfadan çıkın..."
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Üye Girişi
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/signin")}
              sx={{ borderColor: "white", color: "white" }}
            >
              Üye Ol
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ p: 3, mt: 8, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 1100,
            minHeight: 450,
            p: 4,
            boxShadow: 5,
          }}
        >
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            {showAmountInput && (
              <IconButton
                onClick={() => {
                  setShowAmountInput(false);
                  setAmount("");
                }}
                sx={{ mr: 1, fontSize: 20 }}
              >
                ←
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
              {event.title}
            </Typography>
            <Stack direction="row" spacing={2} divider={<span>•</span>}>
              <Typography>{event.time}</Typography>
              <Typography>{event.date}</Typography>
              <Typography>{event.location}</Typography>
            </Stack>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Card
              sx={{
                flex: 1,
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Your Payment
              </Typography>
              <Typography sx={{ mb: 1 }}>
                Tickets ({ticketCount}): {seats}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                VIP Ticket Price: {ticketPrice} TL
              </Typography>
              <Typography>Total Price: {totalPrice} TL</Typography>
            </Card>

            <Card
              sx={{
                flex: 1,
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  value={`Your account balance: ${balance} TL`}
                  InputProps={{ readOnly: true }}
                />

                <Typography fontWeight={700}>Current Payment Method</Typography>

                <Select
                  size="small"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="VISA •••• 1234">VISA •••• 1234</MenuItem>
                  <MenuItem value="Mastercard •••• 5678">
                    Mastercard •••• 5678
                  </MenuItem>
                </Select>

                {showAmountInput ? (
                  <TextField
                    placeholder="Enter amount (TL)"
                    size="small"
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                ) : (
                  <Button variant="outlined" fullWidth>
                    Add Payment Method
                  </Button>
                )}

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setShowAmountInput(true)}
                >
                  Withdraw and Load
                </Button>
              </Stack>
            </Card>
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button variant="contained" size="large" disabled={showAmountInput}>
              Confirm Payment
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default PaymentPage;
