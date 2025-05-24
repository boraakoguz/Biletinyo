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
  Button,
  Stack,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import apiService from "./apiService";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [tickets, setTickets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [followingCount, setFollowingCount] = useState(null);

  const formatBirthDate = (birthDate) => {
    if (!birthDate) return null;
    const dateObj = new Date(birthDate);
    if (isNaN(dateObj)) return null;

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    const raw = localStorage.getItem("user");
    const parsedUser = raw ? JSON.parse(raw) : {};

    if (parsedUser.id) {
      apiService
        .getUserById(parsedUser.id)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Failed to fetch user from DB:", err);
          setUser(parsedUser);
        });

      apiService
        .getFollowingCount(parsedUser.id)
        .then((data) => {
          if (data.following_count !== undefined) {
            setFollowingCount(data.following_count);
          }
        })
        .catch((err) => console.error("Failed to fetch following count:", err));
    }
  }, []);

  useEffect(() => {
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
      {
        id: "103",
        image: "https://picsum.photos/300/150?random=3",
        title: "ELECTRO NIGHT",
        venue: "CLUB X",
        datetime: "20.04.2025 • 22:00",
        guests: 1,
      },
      {
        id: "104",
        image: "https://picsum.photos/300/150?random=4",
        title: "JAZZ FEST",
        venue: "BLUE HALL",
        datetime: "25.04.2025 • 19:30",
        guests: 4,
      },
      {
        id: "105",
        image: "https://picsum.photos/300/150?random=5",
        title: "ROCK POPUP",
        venue: "STADIUM",
        datetime: "30.04.2025 • 18:00",
        guests: 2,
      },
      {
        id: "106",
        image: "https://picsum.photos/300/150?random=6",
        title: "CLASSICAL EVENING",
        venue: "OPERA HOUSE",
        datetime: "05.05.2025 • 20:00",
        guests: 2,
      },
    ]);

    setTransactions([
      {
        id: "P1001",
        amount: 150.0,
        method: "VISA •••• 1234",
        status: "Completed",
        date: "10.04.2025",
      },
      {
        id: "P1002",
        amount: 200.0,
        method: "Wallet",
        status: "Pending",
        date: "12.04.2025",
      },
      {
        id: "P1003",
        amount: 75.5,
        method: "Mastercard •••• 5678",
        status: "Failed",
        date: "01.04.2025",
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

      <Box sx={{ backgroundColor: "#fff", py: 6, minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <Paper elevation={3} sx={{ p: 6, borderRadius: 4 }}>
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
                    {formatBirthDate(user.birth_date) || "—"}
                  </Typography>
                  <Typography fontSize={16}>
                    <strong>Phone:</strong> {user.phone || "—"}
                  </Typography>
                  {followingCount !== null && (
                    <Typography fontSize={16}>
                      <strong>Following:</strong> {followingCount} organizer
                      {followingCount !== 1 ? "s" : ""}
                    </Typography>
                  )}
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
            </Box>

            <Box sx={{ flex: "1 1 300px" }}>
              <Typography variant="h5" gutterBottom>
                Past Transactions
              </Typography>
              <Paper
                elevation={3}
                sx={{ p: 2, borderRadius: 4, height: 400, overflowY: "auto" }}
              >
                {transactions.map((tx) => (
                  <Paper
                    key={tx.id}
                    elevation={1}
                    sx={{ p: 2, mb: 2, borderRadius: 2 }}
                  >
                    <Typography variant="subtitle2">{tx.id}</Typography>
                    <Typography variant="body2">
                      <strong>Amount:</strong> ${tx.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Method:</strong> {tx.method}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {tx.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {tx.date}
                    </Typography>
                  </Paper>
                ))}
              </Paper>
            </Box>
          </Box>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              My Tickets
            </Typography>
            <Grid container spacing={3}>
              {tickets.map((t) => (
                <Grid item xs={12} sm={6} md={6} key={t.id}>
                  <Card
                    sx={{
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
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePage;
