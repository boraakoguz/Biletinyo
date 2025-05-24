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
import { useNavigate, useParams } from "react-router-dom";
import apiService from "./apiService";

function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [organizerName, setOrganizerName] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  useEffect(() => {
    if (event?.image_ids?.length) {
      const imgId = event.image_ids[imgIndex];
      apiService.getImageById(imgId)
        .then((url) => setImageSrc(url))
        .catch((err) => console.error('Failed to load image:', err));
    }
  }, [event, imgIndex]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token && !!user);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await apiService.getEventById(id);
        setEvent(data);
        setError(null);

        if (data.organizer_id) {
          try {
            const response = await fetch(
              `http://localhost:8080/api/users/${data.organizer_id}`
            );
            const orgData = await response.json();
            if (orgData.organizer?.organization_name) {
              setOrganizerName(orgData.organizer.organization_name);
            }
          } catch (orgError) {
            console.error("Failed to fetch organizer info:", orgError);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  const handleComments = () => navigate(`/event/comment?event_id=${id}`);
  const handleLoginRedirect = () => navigate("/login");
  const handleSignInRedirect = () => navigate("/signin");
  const handleProfileRedirect = () => navigate("/profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

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

  const imageUrls = event.image_urls || [];

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
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
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
                      bgcolor: "rgba(255,255,255,0.1)",
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
          <Box sx={{ position: "relative" }}>
            <CardMedia
              component="img"
              height="300"
              image={imageSrc}
              alt={event.event_title}
              sx={{ objectFit: "cover", width: "100%" }}
            />
            {imageUrls.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  transform: "translateY(-50%)",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    setImgIndex(
                      (prev) => (prev - 1 + imageUrls.length) % imageUrls.length
                    )
                  }
                >
                  ◀
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    setImgIndex((prev) => (prev + 1) % imageUrls.length)
                  }
                >
                  ▶
                </Button>
              </Box>
            )}
          </Box>
          <CardContent sx={{ position: "relative", pb: 12 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {event.event_title}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  divider={<span style={{ opacity: 0.25 }}>•</span>}
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  <Typography>{event.event_time}</Typography>
                  <Typography>{event.event_date}</Typography>
                  <Typography>{event.venue_name}</Typography>
                  <Typography>{event.venue_city}</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Typography variant="caption">
                  Organized by: {organizerName}
                </Typography>

                <Typography variant="body2">
                  {event.venue_description}
                </Typography>
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
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/login", {
                      state: {
                        from: `/event/${id}`,
                        message: "Please login to purchase tickets",
                      },
                    });
                  } else {
                    localStorage.setItem("event_id", id);
                    navigate(`/event/${id}/seating`);
                  }
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
