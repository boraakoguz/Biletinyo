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

export default function AddVenue() {
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({ severity: 'success', message: '' });

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  // basit validasyon
  const validate = () => {
    const e = {};
    if (!form.venue_name.trim()) e.venue_name = "Mekan adı gerekli";
    if (!form.city.trim())       e.city        = "Şehir gerekli";
    if (form.rows < 1)           e.rows        = "Satır sayısı en az 1 olmalı";
    if (form.columns < 1)        e.columns     = "Sütun sayısı en az 1 olmalı";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      // gerçek API çağrısı yerine mock
      // await fetch('/api/venues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setSnackbarInfo({ severity: 'success', message: 'Mekan başarıyla eklendi' });
      setOpenSnackbar(true);
      setTimeout(() => navigate('/organizer/venues'), 1200);
    } catch (err) {
      setSnackbarInfo({ severity: 'error', message: 'Mekan eklenirken hata oluştu' });
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: 'italic', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Mekan arayın..."
              disabled
              sx={{ backgroundColor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root fieldset': { border: 'none' } }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate('/login')}>Üye Girişi</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/signin')}>Üye Ol</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Yeni Mekan Ekle
        </Typography>

        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Mekan Adı"
                fullWidth
                value={form.venue_name}
                onChange={handleChange('venue_name')}
                error={!!errors.venue_name}
                helperText={errors.venue_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Şehir"
                fullWidth
                value={form.city}
                onChange={handleChange('city')}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Adres"
                fullWidth
                value={form.address}
                onChange={handleChange('address')}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Satır Sayısı"
                type="number"
                fullWidth
                value={form.rows}
                onChange={handleChange('rows')}
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
                onChange={handleChange('columns')}
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
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/organizer/venues')}>İptal</Button>
                <Button variant="contained" onClick={handleSave}>Kaydet</Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarInfo.severity} onClose={() => setOpenSnackbar(false)}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
}
