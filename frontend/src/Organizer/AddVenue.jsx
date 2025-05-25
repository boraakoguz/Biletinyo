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
    if (!form.venue_name.trim()) e.venue_name = "Venue name required";
    if (!form.city.trim())       e.city        = "City name required";
    if (form.rows < 1)           e.rows        = "At most 1 row required";
    if (form.columns < 1)        e.columns     = "At most 1 column required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      // gerçek API çağrısı yerine mock
      // await fetch('/api/venues', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setSnackbarInfo({ severity: 'success', message: 'Venue added successfully' });
      setOpenSnackbar(true);
      setTimeout(() => navigate('/organizer/venues'), 1200);
    } catch (err) {
      setSnackbarInfo({ severity: 'error', message: 'Error occured when adding venue' });
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
              placeholder="Search venue..."
              disabled
              sx={{ backgroundColor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root fieldset': { border: 'none' } }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/signin')}>Sign In</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Add New Venue
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
                label="City"
                fullWidth
                value={form.city}
                onChange={handleChange('city')}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                fullWidth
                value={form.address}
                onChange={handleChange('address')}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Row Number"
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
                label="Column Number"
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
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/organizer/venues')}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
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
