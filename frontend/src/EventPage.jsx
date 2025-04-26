import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";

function EventPage() {
  const { state: event } = useLocation();
  const navigate = useNavigate();

  /* For now, this will not be in the final code */
  if (!event) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">Etkinlik bulunamadı</Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Ana sayfaya dön
        </Button>
      </Box>
    );
  }

  /* Example data, for now*/
  const ticketOptions = [
    { id: 1, name: "Regular", price: 2000, left: 5 },
    { id: 2, name: "VIP", price: 5000, left: 15 },
    { id: 3, name: "Premium", price: 10000, left: 1 },
  ];

  // Ticket select
  const [selectedTicket, setSelectedTicket] = useState(null);
  const handleSelectTicket = (option) => setSelectedTicket(option);

  const handlePurchase = () => {
    // Not sure, will do later
    // navigate("/purchase", { state: { event, ticket: selectedTicket } });
  };
  const handleComments = () => {
    // Not sure, will do later
  };
  const handleSignInRedirect = () => {
    navigate("/signin");
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
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
              placeholder="Etkinlik, mekan ya da sanatçı arayın..."
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={handleLoginRedirect}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Üye Girişi
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleSignInRedirect}
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                },
              }}
            >
              Üye Ol
            </Button>
          </Stack>
        </Box>
      </Box>
      {/* Continue from here */}
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "100%", maxWidth: 800, boxShadow: 5 }}>
          <CardMedia
            component="img"
            height="220"
            image={event.image}
            alt={event.title}
          />
          <Box
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid rgba(0,0,0,0.12)",
              typography: "body2",
              fontWeight: 500,
            }}
          >
            <Typography sx={{ flexGrow: 1 }}>{event.title}</Typography>
            <Typography sx={{ mx: 2 }}>19.00</Typography>
            <Typography sx={{ mx: 2 }}>{event.date}</Typography>
            <Typography>{event.city ?? "Ankara"}</Typography>
          </Box>

          <CardContent sx={{ pt: 1 }}>
            <Typography variant="body2" gutterBottom>
              {event.description ??
                "The superstar welcomes all of his guests! The concert will be his comeback to the music industry, do not miss! Congresium, Ankara 19.00 " +
                  event.date}
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: { xs: "block", md: "flex" },
                gap: 2,
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  overflowX: "auto",
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                }}
              >
                <IconButton
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                  onClick={(e) =>
                    (e.currentTarget.parentNode.scrollLeft -= 250)
                  }
                ></IconButton>

                <Stack direction="row" spacing={2} sx={{ px: 1 }}>
                  {ticketOptions.map((opt) => {
                    const selected = selectedTicket?.id === opt.id;
                    return (
                      <Card
                        key={opt.id}
                        onClick={() => handleSelectTicket(opt)}
                        sx={{
                          minWidth: 160,
                          borderRadius: 2,
                          cursor: "pointer",
                          border: selected
                            ? "2px solid #002fa7"
                            : "1px solid rgba(0,0,0,0.12)",
                          boxShadow: selected ? 4 : 1,
                        }}
                      >
                        <Box sx={{ p: 1, textAlign: "center" }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {opt.name}
                          </Typography>
                          <Typography variant="body2">
                            {opt.price} TL
                          </Typography>
                          <Typography
                            variant="caption"
                            color={opt.left > 3 ? "success.main" : "error.main"}
                          >
                            {opt.left} Tickets Left
                          </Typography>
                        </Box>
                      </Card>
                    );
                  })}
                </Stack>

                <IconButton
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                  onClick={(e) =>
                    (e.currentTarget.parentNode.scrollLeft += 250)
                  }
                ></IconButton>
              </Box>

              <Stack
                spacing={1}
                sx={{
                  minWidth: 150,
                  alignSelf: "center",
                  mt: { xs: 2, md: 0 },
                }}
              >
                <Button variant="outlined" fullWidth onClick={handleComments}>
                  Comments
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!selectedTicket}
                  onClick={handlePurchase}
                >
                  Purchase Ticket
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default EventPage;
