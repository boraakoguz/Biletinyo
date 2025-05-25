// src/Admin/AdminUserManagement.jsx

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [detailDialog, setDetailDialog] = useState(null);

  useEffect(() => {
    // Mock API çağrısı
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          username: "ali",
          email: "ali@example.com",
          user_type: 0,    // 0=attendee,1=organizer,2=admin
          disabled: false,
          bookings: [
            { event: "Rock Fest", date: "2025-06-15" },
            { event: "Jazz Night", date: "2025-07-10" },
          ],
          events: [],
        },
        {
          id: 2,
          username: "ayse",
          email: "ayse@org.com",
          user_type: 1,
          disabled: true,
          bookings: [],
          events: [
            { title: "Tech Meetup", date: "2025-08-05" },
            { title: "Art Expo", date: "2025-09-12" },
          ],
        },
        {
          id: 3,
          username: "admin",
          email: "admin@biletinyo.com",
          user_type: 2,
          disabled: false,
          bookings: [],
          events: [],
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleToggleOrganizer = (u) => {
    setUsers((us) =>
      us.map((x) =>
        x.id === u.id
          ? { ...x, user_type: x.user_type === 1 ? 0 : 1 }
          : x
      )
    );
  };

  const handleToggleDisabled = (u) => {
    setUsers((us) =>
      us.map((x) =>
        x.id === u.id ? { ...x, disabled: !x.disabled } : x
      )
    );
  };

  const filtered = users
    .filter((u) =>
      roleFilter === "all" ? true : u.user_type.toString() === roleFilter
    )
    .filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
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
      {/* HEADER */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/admin/dashboard")}
          >
            Biletinyo Admin
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexGrow: 1, maxWidth: 500 }}>
            <TextField
              size="small"
              placeholder="Kullanıcı ara..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
            <Select
              size="small"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            >
              <MenuItem value="all">Tümü</MenuItem>
              <MenuItem value="0">Attendee</MenuItem>
              <MenuItem value="1">Organizer</MenuItem>
              <MenuItem value="2">Admin</MenuItem>
            </Select>
          </Box>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/admin/dashboard")}
            sx={{ borderColor: "white" }}
          >
            Geri
          </Button>
        </Toolbar>
      </AppBar>

      {/* KULLANICI LİSTESİ */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Kullanıcı Yönetimi
        </Typography>

        {filtered.length === 0 ? (
          <Typography color="text.secondary">Kullanıcı bulunamadı.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((u) => (
              <Grid item xs={12} sm={6} md={4} key={u.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6">{u.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={
                          u.user_type === 2
                            ? "Admin"
                            : u.user_type === 1
                            ? "Organizer"
                            : "Attendee"
                        }
                        size="small"
                        color={
                          u.user_type === 2
                            ? "secondary"
                            : u.user_type === 1
                            ? "primary"
                            : "default"
                        }
                      />
                      {u.disabled && (
                        <Chip label="Donduruldu" size="small" color="warning" />
                      )}
                    </Stack>
                  </CardContent>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setDetailDialog(u)}
                    >
                      Geçmiş
                    </Button>
                    <Box>
                      {u.user_type !== 2 && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleToggleOrganizer(u)}
                          sx={{ mr: 1 }}
                        >
                          {u.user_type === 1 ? "Organizer’ı Al" : "Organizer Yap"}
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        color={u.disabled ? "success" : "error"}
                        onClick={() => handleToggleDisabled(u)}
                      >
                        {u.disabled ? "Hesap Aktifleştir" : "Hesap Dondur"}
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* GEÇMİŞ DİALOGU */}
        {detailDialog && (
          <Dialog
            open
            onClose={() => setDetailDialog(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {detailDialog.username} – Geçmiş
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6">Booking Geçmişi</Typography>
              <List dense>
                {detailDialog.bookings.length ? (
                  detailDialog.bookings.map((b, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={b.event}
                        secondary={b.date}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Booking yok.
                  </Typography>
                )}
              </List>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Etkinlik Oluşturma Geçmişi
              </Typography>
              <List dense>
                {detailDialog.events.length ? (
                  detailDialog.events.map((e, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={e.title}
                        secondary={e.date}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    Etkinlik yok.
                  </Typography>
                )}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(null)}>Kapat</Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </>
  );
}
