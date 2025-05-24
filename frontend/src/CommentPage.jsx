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

export default function CommentPage() {
  const [comments, setComments] = useState([]);
  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get("event_id");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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

  /* fetch event once */

  useEffect(() => {
    if (!eventId) return;

    const fetchEventAndComments = async () => {
      try {
        const eventRes = await fetch(
          `http://localhost:8080/api/events/${eventId}`
        );
        const eventData = await eventRes.json();
        setEvent(eventData);

        const commentsRes = await fetch(
          `http://localhost:8080/api/comments/event?event_id=${eventId}`
        );
        const commentsData = await commentsRes.json();
        setComments(commentsData);
        const token = localStorage.getItem("token");

        setIsLoggedIn(!!token);
      } catch (err) {
        console.error("Failed to load event or comments", err);
      }
    };

    fetchEventAndComments();
  }, [eventId]);

  const [newText, setNewText] = useState("");
  const [newRate, setNewRate] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  const avg = comments.reduce((s, c) => s + c.rating, 0) / comments.length || 0;

  const send = async () => {
    if (!newTitle.trim() || !newText.trim() || newRate === 0) return;

    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    const userId = user ? Number(user.id) : null;
    const commentPayload = {
      event_id: parseInt(eventId),
      rating: newRate,
      attendee_id: userId,
      comment_title: newTitle.trim(),
      comment_text: newText.trim(),
      comment_date: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:8080/api/comments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentPayload),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      setComments((prev) => [
        ...prev,
        { ...commentPayload, comment_id: Date.now() },
      ]);
      setNewTitle("");
      setNewText("");
      setNewRate(0);
    } catch (err) {
      console.error("Comment send failed:", err);
    }
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
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold",
              fontStyle: "italic",
              "&:hover": {
                textDecoration: "none",
                opacity: 0.8,
              },
            }}
          >
            Biletinyo
          </Typography>

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
                  Login
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
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ p: 3, mt: 8, display: "flex", justifyContent: "center" }}>
        <Card sx={{ p: 4, width: "100%", maxWidth: 1200, minHeight: 550 }}>
          <Typography variant="h5" fontWeight={700}>
            {event.event_title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
            {event.event_time} • {event.event_date} • {event.venue_name}
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
            {isLoggedIn ? (
              <Box sx={{ minWidth: 280 }}>
                <Typography fontWeight={600} mb={1}>
                  Leave a Comment
                </Typography>

                <TextField
                  fullWidth
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Title"
                />

                <Rating
                  value={newRate}
                  onChange={(_, v) => setNewRate(v)}
                  sx={{ mb: 1, mt: 1 }}
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
            ) : (
              <Box sx={{ minWidth: 280 }}>
                <Typography fontWeight={600} mb={2}>
                  You must be logged in to leave a comment.
                </Typography>
                <Button fullWidth variant="contained" onClick={goLogin}>
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                  onClick={goSignIn}
                >
                  Register
                </Button>
              </Box>
            )}

            <Box sx={{ flexGrow: 1, maxHeight: 350, overflowY: "auto", pl: 1 }}>
              <Stack spacing={1}>
                {comments.map((c) => (
                  <Paper
                    key={c.comment_id}
                    sx={{
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Rating value={c.rating} readOnly size="small" />
                    <Typography fontWeight="bold">{c.comment_title}</Typography>
                    <Typography variant="body2">{c.comment_text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.comment_date} • User #{c.attendee_id}
                    </Typography>
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
