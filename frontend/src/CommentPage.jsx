import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Stack,
  TextField,
  Rating,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

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
  new Promise((res, rej) =>
    setTimeout(() => {
      const ev = mockDB.find((e) => e.id === id);
      ev ? res(ev) : rej(new Error("not found"));
    }, 400)
  );

export default function CommentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* fetch event once */
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fakeFetchEventById(id)
      .then((data) => setEvent(data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const [comments, setComments] = useState([
    { id: 1, text: "It was wonderful", rating: 5 },
    { id: 2, text: "Spectacular!", rating: 4 },
    { id: 3, text: "Meh…", rating: 2 },
    { id: 4, text: "Awful.", rating: 1 },
  ]);
  const [newText, setNewText] = useState("");
  const [newRate, setNewRate] = useState(0);

  const avg = comments.reduce((s, c) => s + c.rating, 0) / comments.length || 0;

  const send = () => {
    if (!newText.trim() || newRate === 0) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), text: newText.trim(), rating: newRate },
    ]);
    setNewText("");
    setNewRate(0);
  };

  const goLogin = () => navigate("/login");
  const goSignIn = () => navigate("/signin");

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
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
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1000,
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
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={goLogin}>
              Üye Girişi
            </Button>
            <Button color="inherit" variant="outlined" onClick={goSignIn}>
              Üye Ol
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ p: 3, mt: 8, display: "flex", justifyContent: "center" }}>
        <Card sx={{ p: 4, width: "100%", maxWidth: 1200, minHeight: 550 }}>
          <Typography variant="h5" fontWeight={700}>
            {event.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
            {event.time} • {event.date} • {event.location}
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography>Overall Rating</Typography>
            <Rating value={avg} precision={0.5} readOnly />
            <Typography>{avg.toFixed(1)}/5</Typography>
          </Stack>

          <Box sx={{ display: "flex", gap: 3 }}>
            {/* input side */}
            <Box sx={{ minWidth: 280 }}>
              <Typography fontWeight={600} mb={1}>
                Leave a Comment
              </Typography>
              <Rating
                value={newRate}
                onChange={(_, v) => setNewRate(v)}
                sx={{ mb: 1 }}
              />
              <TextField
                multiline
                minRows={5}
                fullWidth
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Add a comment"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={send}
              >
                Send
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, maxHeight: 350, overflowY: "auto", pl: 1 }}>
              <Stack spacing={1}>
                {comments.map((c) => (
                  <Paper key={c.id} sx={{ p: 1, display: "flex", gap: 1 }}>
                    <Rating value={c.rating} readOnly size="small" />
                    <Typography variant="body2">{c.text}</Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Box>
        </Card>
      </Box>
    </>
  );
}
