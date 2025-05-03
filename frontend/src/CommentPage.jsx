import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Typography,
  Stack,
  TextField,
  Rating,
  Paper,
} from "@mui/material";

function CommentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;

  if (!event) {
    navigate("/");
    return null;
  }

  const [comments, setComments] = useState([
    { id: 1, text: "It was wonderful", rating: 5 },
    { id: 2, text: "Spectacular!", rating: 4 },
    { id: 3, text: "Meh...", rating: 2 },
    { id: 4, text: "Awful, definitely awful.", rating: 1 },
  ]);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(0);

  const average =
    comments.reduce((acc, c) => acc + c.rating, 0) / comments.length || 0;

  const handleSend = () => {
    if (!newText.trim() || newRating === 0) return;
    setComments([
      ...comments,
      { id: Date.now(), text: newText.trim(), rating: newRating },
    ]);
    setNewText("");
    setNewRating(0);
  };

  const handleSignInRedirect = () => navigate("/signin");
  const handleLoginRedirect = () => navigate("/login");

  const timeString =
    event.time ||
    (event.datetime &&
      new Date(event.datetime).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })) ||
    "HH:MM";

  const dateString =
    event.date ||
    (event.datetime && new Date(event.datetime).toLocaleDateString("tr-TR")) ||
    "DD/MM/YYYY";

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
              placeholder="Arama yapmak için bu etkinlikten çıkın..."
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
            <Button
              color="inherit"
              onClick={handleLoginRedirect}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
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
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
              }}
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
            maxWidth: 1200,
            p: 4,
            boxShadow: 5,
            minHeight: 550,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {event.title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {timeString} • {dateString} • {event.location ?? "Null Venue"}
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent="right"
            alignItems="center"
            spacing={1}
            sx={{ mb: 3 }}
          >
            <Typography variant="h8">Overall Rating</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating value={average} precision={0.5} readOnly />
              <Typography>{average.toFixed(1)}/5</Typography>
            </Stack>
          </Stack>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ minWidth: 280 }}>
              <Typography fontWeight={600} mb={1}>
                Leave a Comment
              </Typography>
              <Rating
                value={newRating}
                onChange={(_, v) => setNewRating(v)}
                sx={{ mb: 1 }}
              />
              <TextField
                multiline
                minRows={5}
                placeholder="Add a comment"
                fullWidth
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 1, width: "100%" }}
                onClick={handleSend}
              >
                Send
              </Button>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                maxHeight: 350,
                overflowY: "auto",
                pl: 1,
              }}
            >
              <Stack spacing={1}>
                {comments.map((c) => (
                  <Paper
                    key={c.id}
                    sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}
                  >
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

export default CommentPage;
