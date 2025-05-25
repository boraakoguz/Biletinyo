import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import apiService from "../apiService";

export default function AdminVenueManagement() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedVenueId, setExpandedVenueId] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const [requested, available] = await Promise.all([
          apiService.getRequestedVenues(),
          apiService.getAvailableVenues(),
        ]);
        const normalized = [
          ...available.map((v) => ({ ...v, status: "active" })),
          ...requested.map((v) => ({
            ...v,
            status: "pending",
            organizerNote: `Created by: ${v.venue_description || ""}`,
          })),
        ];
        setVenues(normalized);
      } catch (err) {
        console.error("Failed to load venues", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const fetchCapacities = async () => {
      try {
        const capacities = await Promise.all(
          venues.map((v) =>
            apiService
              .getVenueCapacity(v.venue_id)
              .then((res) => ({ id: v.venue_id, capacity: res.capacity }))
              .catch(() => ({ id: v.venue_id, capacity: 0 }))
          )
        );
        setVenues((prev) =>
          prev.map((v) => {
            const match = capacities.find((c) => c.id === v.venue_id);
            return { ...v, capacity: match?.capacity || 0 };
          })
        );
      } catch (err) {
        console.error("Failed to load capacities", err);
      }
    };

    if (venues.length > 0) {
      fetchCapacities();
    }
  }, [venues.length]);

  const filtered = venues.filter(
    (v) =>
      v.venue_name.toLowerCase().includes(search.toLowerCase()) ||
      v.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      await apiService.acceptVenueRequest(id);
      setVenues((vs) =>
        vs.map((v) => (v.venue_id === id ? { ...v, status: "active" } : v))
      );
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await apiService.rejectVenueRequest(id);
      setVenues((vs) => vs.filter((v) => v.venue_id !== id));
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const toggleExpand = (venueId) => {
    setExpandedVenueId((prev) => (prev === venueId ? null : venueId));
  };

  const renderSeatMap = (map) => (
    <Box sx={{ mt: 1, display: "inline-block", bgcolor: "#f0f0f0", p: 1 }}>
      {map.map((row, rowIdx) => (
        <Box key={rowIdx} sx={{ display: "flex" }}>
          {row.map((seat, colIdx) => (
            <Box
              key={`${rowIdx}-${colIdx}`}
              sx={{
                width: 14,
                height: 14,
                bgcolor:
                  seat === 0
                    ? "#e0e0e0"
                    : seat === 1
                    ? "#90caf9"
                    : seat === 2
                    ? "#ba68c8"
                    : seat === 3
                    ? "#ffb74d"
                    : seat === 4
                    ? "#ef5350"
                    : "#ccc",
                m: 0.2,
                borderRadius: 0.5,
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Biletinyo Admin
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "white" }}
              onClick={() => navigate("/admin/venues/new")}
            >
              Create New Venue
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Venue Yönetimi
        </Typography>
        <Grid container spacing={3}>
          {filtered.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v.venue_id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">{v.venue_name}</Typography>
                    <Chip
                      label={v.status === "pending" ? "Bekliyor" : "Onaylandı"}
                      color={v.status === "pending" ? "warning" : "success"}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {v.city} – {v.location}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => toggleExpand(v.venue_id)}
                    endIcon={
                      expandedVenueId === v.venue_id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    }
                    sx={{ mt: 1 }}
                  >
                    {expandedVenueId === v.venue_id ? "Hide" : "Details"}
                  </Button>
                  <Collapse in={expandedVenueId === v.venue_id}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Capacity:</strong> {v.capacity} Seats
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Description: </strong>
                      {v.venue_description || "Undefined"}
                    </Typography>
                    {renderSeatMap(v.seat_map)}
                  </Collapse>
                </CardContent>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}
                >
                  {v.status === "pending" && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleApprove(v.venue_id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(v.venue_id)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
