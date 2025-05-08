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
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // API bağlantısı (mock)
    setTimeout(() => {
      setData([
        { event_title: "Rock Concert – Duman", total_sales: 1200, total_revenue: 60000 },
        { event_title: "Ajda Pekkan Açık Hava", total_sales: 800, total_revenue: 40000 },
        { event_title: "Jazz Night Live", total_sales: 500, total_revenue: 25000 },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filtered = data.filter(item =>
    item.event_title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ mt: 12, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* ÜST BARKOD */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Etkinlik ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: 'none' },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Üye Girişi
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/signin")}
              sx={{ borderColor: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              Üye Ol
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* İÇERİK */}
      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Satış Analitiği
        </Typography>

        {/* GELİR GRAFİĞİ */}
        <Paper sx={{ p: 3, mb: 4, height: 320 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Etkinliklere Göre Gelir Grafiği
          </Typography>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={filtered} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="event_title" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => `${value} TL`} />
              <Bar dataKey="total_revenue" name="Gelir (TL)" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* SATIŞ LİSTESİ */}
        <Typography variant="h5" gutterBottom>
          Etkinlik Bazlı Satışlar
        </Typography>
        <Grid container spacing={2}>
          {filtered.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ boxShadow: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.event_title}
                  </Typography>
                  <Typography variant="body2">
                    Bilet Adedi: <strong>{item.total_sales}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Gelir: <strong>{item.total_revenue} TL</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
