import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Stack,
  FormControl,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  CardActionArea,
} from "@mui/material";

function MainPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token && !!user);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_type === 1) {
      navigate("/organizer/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();

        if (searchText) params.append("search", searchText);
        if (category) params.append("category", category);
        if (city) params.append("city", city);
        if (
          dateFilter === "this-week" ||
          dateFilter === "this-month" ||
          dateFilter === "future"
        ) {
          const now = new Date();
          let startDate = null;
          let endDate = null;

          if (dateFilter === "this-week") {
            startDate = now.toISOString().split("T")[0];
            const weekFromNow = new Date(now);
            weekFromNow.setDate(now.getDate() + 7);
            endDate = weekFromNow.toISOString().split("T")[0];
          } else if (dateFilter === "this-month") {
            startDate = now.toISOString().split("T")[0];
            const in30Days = new Date();
            in30Days.setDate(now.getDate() + 30);
            endDate = in30Days.toISOString().split("T")[0];
          } else if (dateFilter === "future") {
            startDate = now.toISOString().split("T")[0];
          }

          if (startDate) params.append("start_date", startDate);
          if (endDate) params.append("end_date", endDate);
        }

        const res = await fetch(
          `http://localhost:8080/api/events/?${params.toString()}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const data = await res.json();
        console.log("Fetched events:", data);
        console.log("Fetching with:", params.toString());
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchText, category, city, dateFilter]);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleSignInRedirect = () => {
    navigate("/signin");
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleProfileRedirect = () => navigate("/profile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  const openEvent = (event) => {
    navigate(`/event/${event.event_id}`, { state: { event } });
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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
            {isLoggedIn ? (
              <>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleProfileRedirect}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "white",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </Stack>
        </Box>
      </Box>
      <Container sx={{ mt: 5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Kategori</InputLabel>
            <Select
              label="Kategori"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="konser">Konser</MenuItem>
              <MenuItem value="tiyatro">Tiyatro</MenuItem>
              <MenuItem value="festival">Festival</MenuItem>
              <MenuItem value="sinema">Sinema</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Technology">Technology</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Tarih</InputLabel>
            <Select
              label="Tarih"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="this-week">Bu Hafta</MenuItem>
              <MenuItem value="this-month">Bu Ay</MenuItem>
              <MenuItem value="future">Bu Yıl</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Şehir</InputLabel>
            <Select
              label="Şehir"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="Ankara">Ankara</MenuItem>
              <MenuItem value="istanbul">İstanbul</MenuItem>
              <MenuItem value="izmir">İzmir</MenuItem>
              <MenuItem value="bursa">Bursa</MenuItem>
              <MenuItem value="antalya">Antalya</MenuItem>
              <MenuItem value="adana">Adana</MenuItem>
              <MenuItem value="Konya">Konya</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={3} justifyContent="left" mb={3}>
          {events.map((event, i) => (
            <Grid item key={i}>
              <Card
                sx={{
                  width: 350,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 5,
                }}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => openEvent(event)}
                >
                  <CardMedia
                    component="img"
                    image={event.image}
                    alt={event.title}
                    sx={{ height: 180, objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{event.event_title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.venue_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.event_date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default MainPage;
