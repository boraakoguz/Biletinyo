import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams, Outlet } from "react-router-dom";

const mockDB = [
  {
    id: "1",
    title: "Duman",
    location: "CerModern",
    date: "02 Mayıs 2025",
    price: "900 TL",
    image: "https://via.placeholder.com/300x180?text=Duman",
    time: "20.00",
  },
  {
    id: "2",
    title: "Ajda Pekkan",
    location: "Oran Açıkhava",
    date: "20 Haziran 2025",
    price: "1100 TL",
    image: "https://via.placeholder.com/300x180?text=Ajda+Pekkan",
    time: "19.00",
  },
  {
    id: "3",
    title: "Yaşar",
    location: "ODTÜ MD",
    date: "31 Mayıs 2025",
    price: "700 TL",
    image: "https://via.placeholder.com/300x180?text=Yaşar",
    time: "19.00",
  },
];

const fakeFetchEventById = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const found = mockDB.find((ev) => ev.id === id);
      found ? resolve(found) : reject(new Error("Not found"));
    }, 500);
  });

function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* fetch when id changes */
  useEffect(() => {
    setLoading(true);
    fakeFetchEventById(id)
      .then((data) => {
        setEvent(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleComments = () => navigate(`/event/${id}/comments`);
  const handleLoginRedirect = () => navigate("/login");
  const handleSignInRedirect = () => navigate("/signin");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const ticketOptions = [
    { id: 1, name: "Regular", price: 2000, left: 5 },
    { id: 2, name: "VIP", price: 5000, left: 15 },
    { id: 3, name: "Premium", price: 10000, left: 1 },
  ];

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          boxShadow: 10,
          bgcolor: "#002fa7",
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
              placeholder="Arama yapmak için bu etkinlikten çıkın..."
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={handleLoginRedirect}
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
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
                  bgcolor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
            >
              Üye Ol
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          p: 3,
          mt: 8,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 1100,
            boxShadow: 5,
            borderRadius: "20px",
          }}
        >
          <CardMedia
            component="img"
            height="300"
            image={event.image}
            alt={event.title}
          />
          <CardContent sx={{ position: "relative", pb: 12 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {event.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  divider={<span style={{ opacity: 0.25 }}>•</span>}
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  <Typography>{event.time}</Typography>
                  <Typography>{event.date}</Typography>
                  <Typography>{event.location}</Typography>
                  <Typography>{event.city}</Typography>
                </Stack>

                <Typography variant="body2">{event.description}</Typography>

                <Box sx={{ mt: 2, overflowX: "auto", maxWidth: 520 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ py: 1, whiteSpace: "nowrap" }}
                  >
                    {ticketOptions.map((opt) => {
                      const selected = selectedTicket?.id === opt.id;
                      return (
                        <Card
                          key={opt.id}
                          onClick={() => setSelectedTicket(opt)}
                          sx={{
                            minWidth: 150,
                            cursor: "pointer",
                            flexShrink: 0,
                            border: selected
                              ? "2px solid #002fa7"
                              : "1px solid rgba(0,0,0,0.12)",
                            boxShadow: 3,
                          }}
                        >
                          <Box sx={{ p: 1, textAlign: "center" }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {opt.name}
                            </Typography>
                            <Typography variant="body2">
                              {opt.price} TL
                            </Typography>
                            <Typography
                              variant="caption"
                              color={
                                opt.left > 3 ? "success.main" : "error.main"
                              }
                            >
                              {opt.left} Tickets Left
                            </Typography>
                          </Box>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                position: "absolute",
                bottom: 30,
                right: 20,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                sx={{ width: 200 }}
                onClick={handleComments}
              >
                Comments
              </Button>
              <Button
                variant="contained"
                sx={{ width: 200 }}
                disabled={!selectedTicket}
                onClick={() => {
                  /* purchase */
                }}
              >
                Purchase Ticket
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default EventPage;
