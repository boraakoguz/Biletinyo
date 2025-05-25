import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  TextField,
  Stack,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminAddVenue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    venue_name: "",
    city: "",
    address: "",
    rows: 10,
    columns: 10,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.venue_name.trim()) e.venue_name = "Mekan adı zorunlu";
    if (!form.city.trim()) e.city = "Şehir zorunlu";
    if (form.rows < 1) e.rows = "Satır ≥ 1 olmalı";
    if (form.columns < 1) e.columns = "Sütun ≥ 1 olmalı";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // → TODO: apiService.createVenue(form)
    setSnackbar({ open: true, severity: "success", message: "Mekan oluşturuldu" });
    setTimeout(() => navigate("/admin/venues"), 1000);
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Biletinyo Admin
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate("/admin/venues")}
            sx={{ borderColor: "white" }}
          >
            Geri
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Mekan Ekle
        </Typography>
        <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Mekan Adı"
                fullWidth
                value={form.venue_name}
                onChange={handleChange("venue_name")}
                error={!!errors.venue_name}
                helperText={errors.venue_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Şehir"
                fullWidth
                value={form.city}
                onChange={handleChange("city")}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres"
                fullWidth
                value={form.address}
                onChange={handleChange("address")}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Satır Sayısı"
                type="number"
                fullWidth
                value={form.rows}
                onChange={handleChange("rows")}
                error={!!errors.rows}
                helperText={errors.rows}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Sütun Sayısı"
                type="number"
                fullWidth
                value={form.columns}
                onChange={handleChange("columns")}
                error={!!errors.columns}
                helperText={errors.columns}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange("description")}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "right" }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate("/admin/venues")}>
                  İptal
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Kaydet
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
