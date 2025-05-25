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
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import apiService from "../apiService";

export default function AdminReports() {
  const navigate = useNavigate();
  const [popularEvents, setPopularEvents] = useState([]);
  const [topRevenueEvents, setTopRevenueEvents] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [refundData, setRefundData] = useState([]); // still mocked

  useEffect(() => {
    (async () => {
      try {
        const topEvents = await apiService.getTopEvents();
        const dailyRevenue = await apiService.getDailyRevenue();

        setPopularEvents(
          topEvents.map((e) => ({
            title: e.event_title,
            ticketsSold: e.tickets_sold,
          }))
        );

        setTopRevenueEvents(
          topEvents.map((e) => ({
            title: e.event_title,
            revenue: e.revenue,
          }))
        );

        setSalesData(
          dailyRevenue.map((r) => ({ date: r.date, sales: r.total_amount }))
        );
      } catch (err) {
        console.error("Failed to load reports:", err);
      }
    })();
  }, []);

  const exportCSV = () => {
    const rows = [
      ["Event Title", "Tickets Sold"],
      ...popularEvents.map((e) => [e.title, e.ticketsSold]),
      [],
      ["Event Title", "Revenue"],
      ...topRevenueEvents.map((e) => [e.title, e.revenue]),
      [],
      ["Date", "Sales"],
      ...salesData.map((s) => [s.date, s.sales]),
      [],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
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
            Back
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>

        <Grid container spacing={4} mb={4}>
          {/* Popular Events */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Most Popular Events
                </Typography>
                <List dense>
                  {popularEvents.map((e, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={e.title}
                        secondary={`${e.ticketsSold} Ticket sold`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Highest Revenue Events */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Most Earning Events
                </Typography>
                <List dense>
                  {topRevenueEvents.map((e, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={e.title}
                        secondary={`${e.revenue.toLocaleString()} ₺`}
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
              Ticket Sales Graph (Daily)
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
        </Grid>

        {/* Export Buttons */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={exportCSV}>
            Download as CSV
          </Button>
        </Stack>
      </Container>
    </>
  );
}
