import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminPendingEvents() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [detailDialog, setDetailDialog] = useState(null);

  useEffect(() => {
    // Mock API çağrısı
    setTimeout(() => {
      setPending([
        {
          event_id: 101,
          event_title: "Rock Fest 2025",
          event_date: "2025-06-15T20:00",
          category: "Müzik",
          venue_name: "City Arena",
          location: "Kadıköy, İstanbul",
          organizer: "boraakoguz",
        },
        {
          event_id: 102,
          event_title: "Tech Summit",
          event_date: "2025-07-01T09:00",
          category: "Konferans",
          venue_name: "Congresium",
          location: "Ankara",
          organizer: "tech_org",
        },
        {
          event_id: 103,
          event_title: "Açık Hava Sineması",
          event_date: "2025-08-05T21:30",
          category: "Sinem a",
          venue_name: "City Park",
          location: "İstanbul",
          organizer: "filmclub",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id) => {
    setPending((p) => p.filter((e) => e.event_id !== id));
    // → TODO: apiService.approveEvent(id)
  };
  const handleReject = (id) => {
    setPending((p) => p.filter((e) => e.event_id !== id));
    // → TODO: apiService.rejectEvent(id)
  };

  const filtered = pending.filter(
    (e) =>
      e.event_title.toLowerCase().includes(filter.toLowerCase()) ||
      e.organizer.toLowerCase().includes(filter.toLowerCase()) ||
      e.venue_name.toLowerCase().includes(filter.toLowerCase())
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
      {/* GLOBAL HEADER */}
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard")}
          >
            Biletinyo Admin
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Etkinlik, mekan veya organizatör ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
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

      <Container sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Bekleyen Etkinlik Onayları
        </Typography>

        {filtered.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Onay bekleyen etkinlik yok.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((e) => (
              <Grid item xs={12} sm={6} md={4} key={e.event_id}>
                <Card sx={{ boxShadow: 3, position: "relative" }}>
                  <CardContent>
                    <Typography variant="h6">{e.event_title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(e.event_date).toLocaleString("tr-TR")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {e.category} • {e.venue_name}, {e.location}
                    </Typography>
                    <Chip
                      label={`@${e.organizer}`}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ p: 2, pt: 0, justifyContent: "space-between" }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setDetailDialog(e)}
                    >
                      Detay
                    </Button>
                    <Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleApprove(e.event_id)}
                        sx={{ mr: 1 }}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleReject(e.event_id)}
                      >
                        Reddet
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Detay Dialog */}
        {detailDialog && (
          <Dialog
            open
            onClose={() => setDetailDialog(null)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Etkinlik Detayları</DialogTitle>
            <DialogContent dividers>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Başlık"
                    secondary={detailDialog.event_title}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tarih"
                    secondary={new Date(detailDialog.event_date).toLocaleString("tr-TR")}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Kategori"
                    secondary={detailDialog.category}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mekan"
                    secondary={`${detailDialog.venue_name}, ${detailDialog.location}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Organizer"
                    secondary={`@${detailDialog.organizer}`}
                  />
                </ListItem>
                {/* Açıklama varsa */}
                {detailDialog.description && (
                  <ListItem>
                    <ListItemText
                      primary="Açıklama"
                      secondary={detailDialog.description}
                    />
                  </ListItem>
                )}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(null)}>Kapat</Button>
              <Button
                onClick={() => {
                  navigate(`/event/${detailDialog.event_id}`);
                }}
              >
                Önizleme
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </>
  );
}
