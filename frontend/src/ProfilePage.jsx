import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Avatar,
  Grid,
  Button,
  Stack,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [tickets, setTickets] = useState([]);

  const getBirthYear = (birthDate) => {
    if (!birthDate) return null;
    const year = new Date(birthDate).getFullYear();
    return isNaN(year) ? null : year;
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : {});
    setTickets([
      {
        id: "101",
        image: "https://picsum.photos/300/150?random=1",
        title: "BOOM CONCERT",
        venue: "BOOM CITY",
        datetime: "15.04.2025 • 15:00",
        guests: 2,
      },
      {
        id: "102",
        image: "https://picsum.photos/300/150?random=2",
        title: "YALIN LIVE",
        venue: "CERNMODERN",
        datetime: "15.04.2025 • 15:00",
        guests: 3,
      },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#002fa7" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography
            variant="h5"
            sx={{
              textDecoration: "underline",
              fontStyle: "italic",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: "#ffffff", py: 6, minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Profile Box */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ p: 6, borderRadius: 4, height: "100%" }}
              >
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "#002fa7",
                      fontSize: 48,
                    }}
                  >
                    {user.name ? user.name.charAt(0) : "U"}
                  </Avatar>
                  <Typography variant="h5">
                    {user.name || "Unknown User"}
                  </Typography>
                  <Typography color="text.secondary" fontSize={18}>
                    {user.email || "—"}
                  </Typography>
                  <Typography fontSize={16}>
                    <strong>Birth Year:</strong>{" "}
                    {getBirthYear(user.birth_date) || "—"}
                  </Typography>
                  <Typography fontSize={16}>
                    <strong>Phone:</strong> {user.phone || "—"}
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Tickets */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                My Tickets
              </Typography>
              <Grid container spacing={3}>
                {tickets.map((t) => (
                  <Grid item key={t.id}>
                    <Card
                      sx={{
                        width: 250,
                        height: 400,
                        boxShadow: 3,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate(`/ticket/${t.id}`)}
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={t.image}
                          alt={t.title}
                          sx={{ height: 150, objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">{t.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.venue}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.datetime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Guests: {t.guests}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePage;
