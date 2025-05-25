// src/Admin/AdminReports.jsx

import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminReports() {
  const navigate = useNavigate();
  const [popularEvents, setPopularEvents] = useState([]);
  const [topOrganizers, setTopOrganizers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [refundData, setRefundData] = useState([]);

  useEffect(() => {
    // Mock API data
    setPopularEvents([
      { title: "Rock Fest 2025", ticketsSold: 1200 },
      { title: "Tech Summit", ticketsSold: 900 },
      { title: "Jazz Night Live", ticketsSold: 800 },
    ]);
    setTopOrganizers([
      { name: "boraakoguz", revenue: 30000 },
      { name: "tech_org", revenue: 25000 },
      { name: "filmclub", revenue: 20000 },
    ]);
    setSalesData([
      { date: "2025-05-01", sales: 200 },
      { date: "2025-05-05", sales: 450 },
      { date: "2025-05-10", sales: 300 },
      { date: "2025-05-15", sales: 600 },
      { date: "2025-05-20", sales: 500 },
      { date: "2025-05-25", sales: 700 },
    ]);
    setRefundData([
      { category: "Müzik", rate: 5 },
      { category: "Konferans", rate: 3 },
      { category: "Spor", rate: 2 },
      { category: "Tiyatro", rate: 4 },
    ]);
  }, []);

  const exportCSV = () => {
    const rows = [
      ["Event Title", "Tickets Sold"],
      ...popularEvents.map(e => [e.title, e.ticketsSold]),
      [],
      ["Organizer", "Revenue"],
      ...topOrganizers.map(o => [o.name, o.revenue]),
      [],
      ["Date", "Sales"],
      ...salesData.map(s => [s.date, s.sales]),
      [],
      ["Category", "Refund Rate (%)"],
      ...refundData.map(r => [r.category, r.rate]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* HEADER */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            onClick={() => navigate("/admin/dashboard")}
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
          >
            Biletinyo Admin
          </Typography>
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

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Raporlar & Analitik
        </Typography>

        <Grid container spacing={4} mb={4}>
          {/* Popular Events */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  En Popüler Etkinlikler
                </Typography>
                <List dense>
                  {popularEvents.map((e, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={e.title}
                        secondary={`${e.ticketsSold} bilet satıldı`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Organizers */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  En Çok Gelir Getiren Organizer’lar
                </Typography>
                <List dense>
                  {topOrganizers.map((o, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`@${o.name}`}
                        secondary={`${o.revenue.toLocaleString()} ₺`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} mb={4}>
          {/* Sales Over Time */}
          <Grid item xs={12} md={6} height={300}>
            <Typography variant="h6" gutterBottom>
              Bilet Satış Grafiği (Günlük)
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={salesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Refund Rates */}
          <Grid item xs={12} md={6} height={300}>
            <Typography variant="h6" gutterBottom>
              İptal Oranları (%)
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={refundData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rate" fill="#d32f2f" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={exportCSV}>
            CSV Olarak İndir
          </Button>
          <Button variant="outlined" disabled>
            PDF Olarak İndir
          </Button>
        </Stack>
      </Container>
    </>
  );
}
