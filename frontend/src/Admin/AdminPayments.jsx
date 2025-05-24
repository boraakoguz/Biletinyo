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
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

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
          refund_requested: false,
          is_refunded: false,
        },
        {
          payment_id: 202,
          user: "ayse",
          event_title: "Tech Summit",
          amount: 200,
          status: "failed",
          date: "2025-05-12T11:20",
          refund_requested: false,
          is_refunded: false,
        },
        {
          payment_id: 203,
          user: "mehmet",
          event_title: "Jazz Night",
          amount: 120,
          status: "success",
          date: "2025-05-15T17:45",
          refund_requested: true,
          is_refunded: false,
        },
        {
          payment_id: 204,
          user: "ayse",
          event_title: "Art Expo",
          amount: 80,
          status: "success",
          date: "2025-05-18T09:10",
          refund_requested: true,
          is_refunded: true,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleProcessRefund = (id) => {
    setPayments((ps) =>
      ps.map((p) =>
        p.payment_id === id
          ? { ...p, is_refunded: true }
          : p
      )
    );
    setSnackbar({ open: true, message: "İade işlemi gerçekleştirildi." });
  };

  const filtered = payments
    .filter((p) => {
      switch (filter) {
        case "success":
          return p.status === "success" && !p.refund_requested;
        case "failed":
          return p.status === "failed";
        case "refund_requested":
          return p.refund_requested && !p.is_refunded;
        case "refunded":
          return p.is_refunded;
        default:
          return true;
      }
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
              <MenuItem value="refund_requested">İade Talebi</MenuItem>
              <MenuItem value="refunded">İade Edilen</MenuItem>
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
          Ödeme & İade İzleme
        </Typography>
        {filtered.length === 0 ? (
          <Typography color="text.secondary">Kayıt bulunamadı.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.payment_id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      #{p.payment_id} –{" "}
                      {new Date(p.date).toLocaleString("tr-TR")}
                    </Typography>
                    <Typography variant="h6">{p.event_title}</Typography>
                    <Typography variant="body2">
                      @{p.user} – {p.amount} ₺
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={
                          p.is_refunded
                            ? "İade Edildi"
                            : p.refund_requested
                            ? "İade Talebi"
                            : p.status === "success"
                            ? "Başarılı"
                            : "Başarısız"
                        }
                        size="small"
                        color={
                          p.is_refunded
                            ? "secondary"
                            : p.refund_requested
                            ? "warning"
                            : p.status === "success"
                            ? "success"
                            : "error"
                        }
                      />
                    </Stack>
                  </CardContent>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}
                  >
                    {p.refund_requested && !p.is_refunded && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleProcessRefund(p.payment_id)}
                      >
                        İade Yap
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity="info">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
