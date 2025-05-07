// frontend/src/Organizer/SeatingConfig.jsx

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
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useNavigate, useParams } from "react-router-dom";

const toRowLabel = (n) => {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

export default function SeatingConfig() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Başlık için mock venues ---
  const [venueName, setVenueName] = useState("");
  const mockVenues = [
    { venue_id: "1", venue_name: "Bilkent Konser Salonu" },
    { venue_id: "2", venue_name: "City Park Açık Hava" },
    // gerekirse başkalarını ekleyin
  ];

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [seats, setSeats] = useState({}); // {"1-1": true, ...}
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // 1) localeStorage ve satır/sütun yüklemesi: sadece id'ye bağlı
  useEffect(() => {
    // Başlığı ayarla
    const v = mockVenues.find((v) => v.venue_id === id);
    setVenueName(v ? v.venue_name : `Mekan #${id}`);

    // Oturma planını yükle
    const key = `venue-${id}-seating`;
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    if (stored) {
      setRows(stored.rows);
      setCols(stored.cols);
      setSeats(stored.seats);
    } else {
      // ilk yüklemede full grid
      const grid = {};
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          grid[`${r}-${c}`] = true;
        }
      }
      setSeats(grid);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleSeat = (r, c) => {
    const key = `${r}-${c}`;
    setSeats((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleSave = () => {
    const payload = { rows, cols, seats };
    localStorage.setItem(`venue-${id}-seating`, JSON.stringify(payload));
    setSnackbar({
      open: true,
      severity: "success",
      message: "Oturma planı kaydedildi",
    });
  };

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* ===== HEADER ===== */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate("/organizer/venues")}
            sx={{ fontWeight: "bold" }}
          >
            Geri
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===== CONTENT ===== */}
      <Container sx={{ my: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          {venueName} Oturma Planı
        </Typography>

        {/* Satır/Sütun Değiştirme + Kaydet */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Satır sayısı"
              type="number"
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, Math.min(26 * 26, +e.target.value)))
              }
              size="small"
            />
            <TextField
              label="Sütun sayısı"
              type="number"
              value={cols}
              onChange={(e) =>
                setCols(Math.max(1, Math.min(50, +e.target.value)))
              }
              size="small"
            />
            <Button variant="contained" onClick={handleSave}>
              Kaydet
            </Button>
          </Stack>
        </Paper>

        {/* Koltuk Izgarası */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Grid container direction="column" spacing={1}>
              {Array.from({ length: rows }).map((_, r) => (
                <Grid
                  container
                  item
                  key={r}
                  alignItems="center"
                  spacing={1}
                >
                  {/* Satır Etiketi */}
                  <Grid
                    item
                    sx={{ width: 30, textAlign: "center", fontWeight: "bold" }}
                  >
                    {toRowLabel(r + 1)}
                  </Grid>

                  {/* Koltuk Hücreleri */}
                  {Array.from({ length: cols }).map((_, c) => {
                    const key = `${r + 1}-${c + 1}`;
                    // tanımsız anahtar da true kabul et
                    const active = key in seats ? seats[key] : true;
                    return (
                      <Grid item key={c}>
                        <Box
                          onClick={() => toggleSeat(r + 1, c + 1)}
                          sx={{
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: active ? "primary.main" : "#ddd",
                            color: active ? "white" : "#888",
                            borderRadius: 0.5,
                            cursor: "pointer",
                            transition: "0.1s all",
                            "&:hover": { opacity: 0.8 },
                          }}
                        >
                          <EventSeatIcon fontSize="small" />
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              ))}

              {/* Sütun Numaraları (row-label genişliği kadar padding) */}
              <Grid
                container
                item
                sx={{ mt: 2, pl: "30px" }}
                spacing={1}
              >
                {Array.from({ length: cols }).map((_, c) => (
                  <Grid
                    item
                    key={c}
                    sx={{ width: 32, textAlign: "center", fontWeight: "bold" }}
                  >
                    {c + 1}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* ===== SNACKBAR ===== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackbar((s) => ({ ...s, open: false }))
        }
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((s) => ({ ...s, open: false }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
