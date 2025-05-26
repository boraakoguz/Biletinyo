import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../apiService";

export default function AdminPayments() {
  const navigate = useNavigate();
  const [payloads, setPayloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const reports = await apiService.getAllReports();
        const ticketSales = reports
          .filter((r) => r.report_name === "ticket_sale")
          .map((r) => r.payload);
        setPayloads(ticketSales);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
          >
            Biletinyo Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Ticket Sales Report
        </Typography>

        <Stack spacing={2}>
          {payloads.map((p, idx) => (
            <Card key={idx} sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6">Payment #{p.payment_id}</Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>
                  <strong>Amount:</strong> {p.amount} ₺
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(p.date).toLocaleDateString("tr-TR")}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
}
