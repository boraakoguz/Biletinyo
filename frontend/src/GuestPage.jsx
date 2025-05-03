import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";

function GuestPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event || {
    title: "Rock Concert Name 2 - VIP Section",
    time: "19.00",
    date: "30.03.2025",
    location: "Ankara",
  };

  const formCount = 3;
  const seats = "B4, B5, B6";

  const forms = Array.from({ length: formCount }, (_, i) => (
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
        Guest {i + 1}
      </Typography>
      <Stack spacing={1}>
        <TextField label="Name" size="small" fullWidth />
        <TextField label="Mail" size="small" fullWidth />
        <TextField label="Contact Number" size="small" fullWidth />
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
              variant="outlined"
              placeholder="Arama yapmak için bu sayfadan çıkın..."
              size="small"
              disabled
              fullWidth
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
        <Card sx={{ width: "100%", maxWidth: 1100, p: 4, boxShadow: 5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              {event.title}
            </Typography>
            <Stack direction="row" spacing={2} divider={<span>•</span>}>
              <Typography>{event.time}</Typography>
              <Typography>{event.date}</Typography>
              <Typography>{event.location}</Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              mt: 2,
              overflowX: "auto",
              pb: 1,
            }}
          >
            <Stack direction="row" spacing={3}>
              {forms}
            </Stack>
          </Box>

          <Typography sx={{ mt: 2 }}>Seats: {seats}</Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={() => navigate("/")}>
              Continue
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  );
}

export default GuestPage;
