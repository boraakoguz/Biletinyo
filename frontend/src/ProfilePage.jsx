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
    const raw = localStorage.getItem("user");
    const parsedUser = raw ? JSON.parse(raw) : {};

    if (parsedUser.id) {
      apiService
        .getPaymentsByUserId(parsedUser.id)
        .then((payments) => {
          const formatted = payments.map((p) => ({
            id: p.payment_id,
            amount: parseFloat(p.payment_amount),
            method: p.payment_method === 0 ? "Credit Card" : "Wallet",
            date: new Date(p.payment_date).toLocaleDateString("en-GB"),
          }));
          setTransactions(formatted);
        })
        .catch((err) => {
          console.error("Failed to fetch payment history:", err);
        });
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const parsedUser = raw ? JSON.parse(raw) : {};

    const fetchTicketsWithEvent = async () => {
      if (!parsedUser.id) return;
      try {
        const ticketsData = await apiService.getTicketsByUserId(parsedUser.id);
        const enriched = await Promise.all(
          ticketsData.map(async (t) => {
            const event = await apiService.getEventById(t.event_id);
            const imageSrc = event.image_ids?.[0]
              ? await apiService.getImageById(event.image_ids[0])
              : null;
            return {
              id: t.ticket_id,
              payment_id: t.payment_id,
              event_id: t.event_id,
              image: imageSrc,
              title: event.event_title,
              venue: event.venue_name,
              datetime: `${event.event_date} • ${event.event_time}`,
              guests: t.ticket_guest.length,
              eventImages: event.image_urls,
              seat: { row: t.seat_row, col: t.seat_column },
              guest: t.ticket_guest[0] || {},
              price: t.price,
            };
          })
        );
        const grouped = Object.values(
          enriched.reduce((acc, ticket) => {
            const key = ticket.event_id;
            if (!acc[key]) {
              acc[key] = {
                event_id:   ticket.event_id,
                image:      ticket.image,
                title:      ticket.title,
                venue:      ticket.venue,
                datetime:   ticket.datetime,
                seats:      [],
                guests:     [],
                totalPaid:  0,
              };
            }
            acc[key].seats.push(ticket.seat);
            acc[key].guests.push(ticket.guest);
            acc[key].totalPaid += ticket.price;
            return acc;
          }, {})
        );
        setTickets(grouped);
      } catch (err) {
        console.error("Failed to fetch tickets or events:", err);
      }
    };

    fetchTicketsWithEvent();
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
                    <Typography variant="subtitle2"><strong>Payment ID: </strong> {tx.id}</Typography>
                    <Typography variant="body2">
                      <strong>Amount:</strong> ${tx.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Method:</strong> {tx.method}
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 3,
                alignItems: "stretch",
              }}
            >
              {tickets.map((t) => (
                <Box key={t.event_id} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Card
                    sx={{
                      flexGrow: 1,
                      width: '100%',
                      boxShadow: 3,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea
                      onClick={() =>
                        navigate(`/tickets/group?event_id=${t.event_id}&attendee_id=${user.id}`)
                      }
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
                        sx={{ width: '100%', height: 150, objectFit: "cover" }}
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
                          Guests: {t.guests.length}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ProfilePage;
