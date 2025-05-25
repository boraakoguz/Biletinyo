import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService";
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
  Tabs,
  Tab,
  Divider,
} from "@mui/material";

function MainPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [category, setCategory] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const handleTab = (_, v) => setTab(v);
  const [orgs, setOrgs] = useState([]);
  const [followedEvents, setFollowedEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [followerCounts, setFollowerCounts] = useState(0);
  const TABS = {
    EVENTS: 0,
    FOLLOWED: 1,
    ORGANIZERS: isLoggedIn ? 2 : 1,
  };

  const loadFollowerCounts = async () => {
    try {
      const counts = await apiService.getFollowerCounts();
      const countMap = {};
      counts.forEach(({ organizer_id, follower_count }) => {
        countMap[organizer_id] = follower_count;
      });
      setFollowerCounts(countMap);
    } catch (err) {
      console.error("Failed to load follower counts:", err);
    }
  };

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
    if (tab !== TABS.ORGANIZERS) return;

    const controller = new AbortController();

    apiService
      .getUsers({ user_type: 1, search: search })
      .then(setOrgs)
      .catch(console.error);

    return () => controller.abort();
  }, [tab, search]);

  const [followedData, setFollowedData] = useState([]);

  useEffect(() => {
    const flag = localStorage.getItem("refreshFollowedTab");
    if (flag === "true") {
      setRefreshKey((k) => k + 1);
      localStorage.removeItem("refreshFollowedTab");
    }
  }, [tab]);

  useEffect(() => {
    if (tab === TABS.ORGANIZERS || tab === TABS.FOLLOWED) {
      loadFollowerCounts();
    }
  }, [tab, search, refreshKey]);

  useEffect(() => {
    if (tab !== TABS.FOLLOWED) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    (async () => {
      try {
        const follows = await apiService.getUserFollows(user.id);

        const result = [];

        for (const follow of follows) {
          const org1 = await apiService.getUserById(follow.organizer_id);
          const events = await apiService.getEventsByOrganizer(
            follow.organizer_id
          );
          result.push({ organizer: org1, events });
        }

        setFollowedData(result);
      } catch (err) {
        console.error("Failed to load followed events:", err);
      }
    })();
  }, [tab, refreshKey]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
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
        const data = await apiService.getEvents(params.toString());
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
  }, [search, category, city, dateFilter]);

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
              fullWidth
              size="small"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                tab === 0
                  ? "Search events, venues or artists…"
                  : "Search organizers…"
              }
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
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
      <Box sx={{ bgcolor: "#fafafa" }}>
        <Tabs value={tab} onChange={handleTab} centered>
          <Tab label="Events" sx={{ fontWeight: 600 }} />
          {isLoggedIn && (
            <Tab label="Followed Organizers" sx={{ fontWeight: 600 }} />
          )}
          <Tab label="Organizers" sx={{ fontWeight: 600 }} />
        </Tabs>
        <Divider />
      </Box>
      {tab === TABS.EVENTS && (
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
              <InputLabel>Category</InputLabel>
              <Select
                label="Kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Concert">Concert</MenuItem>
                <MenuItem value="Theatre">Theatre</MenuItem>
                <MenuItem value="Festival">Festival</MenuItem>
                <MenuItem value="Cinema">Cinema</MenuItem>
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
              <InputLabel>Date</InputLabel>
              <Select
                label="Tarih"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="this-week">This week</MenuItem>
                <MenuItem value="this-month">This Month</MenuItem>
                <MenuItem value="future">This Year</MenuItem>
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
              <InputLabel>City</InputLabel>
              <Select
                label="Şehir"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Ankara">Ankara</MenuItem>
                <MenuItem value="Istanbul">İstanbul</MenuItem>
                <MenuItem value="Izmir">İzmir</MenuItem>
                <MenuItem value="Bursa">Bursa</MenuItem>
                <MenuItem value="Antalya">Antalya</MenuItem>
                <MenuItem value="Adana">Adana</MenuItem>
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
                      image={`http://localhost:8080${
                        event.image_urls?.[0] || "/api/images/default.png"
                      }`}
                      alt={event.title}
                      sx={{ height: 180, objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{event.event_title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.venue_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.event_date).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        {" • "}
                        {new Date(
                          `${event.event_date}T${event.event_time}`
                        ).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}
      {isLoggedIn && tab === TABS.FOLLOWED && (
        <Container sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Followed Organizations
          </Typography>
          {followedData.length === 0 ? (
            <Typography color="text.secondary">No Event Found</Typography>
          ) : (
            followedData.map(({ organizer, events }) => (
              <Box key={organizer.id} sx={{ mb: 4 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate(`/organizer/${organizer.id}`)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                    }}
                  >
                    {organizer.organizer?.organization_name || organizer.name}
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {followerCounts[organizer.id] || 0} followers
                  </Typography>
                </Stack>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {events.map((event) => (
                    <Grid item key={event.event_id}>
                      <Card sx={{ width: 350, height: 300 }}>
                        <CardActionArea onClick={() => openEvent(event)}>
                          <CardMedia
                            component="img"
                            image={event.image}
                            alt={event.title}
                            sx={{ height: 180, objectFit: "cover" }}
                          />
                          <CardContent>
                            <Typography variant="h6">
                              {event.event_title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {event.venue_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.event_date).toLocaleDateString()}{" "}
                              •{" "}
                              {new Date(
                                `${event.event_date}T${event.event_time}`
                              ).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))
          )}
        </Container>
      )}
      {tab === TABS.ORGANIZERS && (
        <Container sx={{ mt: 5, maxWidth: 600 }}>
          <Box sx={{ mt: 3 }}>
            {orgs.map((org) => (
              <Card key={org.id} sx={{ mb: 2 }}>
                <CardActionArea
                  onClick={() => navigate(`/organizer/${org.id}`)}
                  sx={{ p: 2 }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={700} color="primary">
                      {org.organization_name || org.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {followerCounts[org.id] || 0} followers
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{org.email}</Typography>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      )}
    </>
  );
}

export default MainPage;
