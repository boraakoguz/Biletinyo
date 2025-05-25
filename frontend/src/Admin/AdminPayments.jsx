// src/Admin/AdminPayments.jsx

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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock API çağrısı
    setTimeout(() => {
      setPayments([
        {
          payment_id: 201,
          user: "ali",
          event_title: "Rock Fest 2025",
          amount: 150,
          status: "success",
          date: "2025-05-10T14:30",
        },
        {
          payment_id: 202,
          user: "ayse",
          event_title: "Tech Summit",
          amount: 200,
          status: "failed",
          date: "2025-05-12T11:20",
        },
        {
          payment_id: 203,
          user: "mehmet",
          event_title: "Jazz Night",
          amount: 120,
          status: "success",
          date: "2025-05-15T17:45",
        },
        {
          payment_id: 204,
          user: "ayse",
          event_title: "Art Expo",
          amount: 80,
          status: "success",
          date: "2025-05-18T09:10",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = payments
    .filter((p) => {
      if (filter === "success") return p.status === "success";
      if (filter === "failed") return p.status === "failed";
      return true;
    })
    .filter(
      (p) =>
        p.user.toLowerCase().includes(search.toLowerCase()) ||
        p.event_title.toLowerCase().includes(search.toLowerCase())
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
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
          >
            Biletinyo Admin
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexGrow: 1,
              maxWidth: 500,
            }}
          >
            <TextField
              size="small"
              placeholder="Kullanıcı veya etkinlik ara..."
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            >
              <MenuItem value="all">Tümü</MenuItem>
              <MenuItem value="success">Başarılı</MenuItem>
              <MenuItem value="failed">Başarısız</MenuItem>
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

      {/* ÖDEME LİSTESİ */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Ödeme Takibi
        </Typography>

        {filtered.length === 0 ? (
          <Typography color="text.secondary">Kayıt bulunamadı.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.payment_id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      #{p.payment_id} –{" "}
                      {new Date(p.date).toLocaleString("tr-TR")}
                    </Typography>
                    <Typography variant="h6">{p.event_title}</Typography>
                    <Typography variant="body2">
                      @{p.user} – {p.amount} ₺
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={p.status === "success" ? "Başarılı" : "Başarısız"}
                        size="small"
                        color={p.status === "success" ? "success" : "error"}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
