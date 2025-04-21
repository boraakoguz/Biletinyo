import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Stack,
  Chip,
} from "@mui/material";

const exampleEvents = [
  {
    title: "Duman",
    location: "CerModern",
    date: "02 May 2025",
    price: "900 TL",
    image: "https://via.placeholder.com/300x180?text=Duman",
  },
  {
    title: "Ajda Pekkan",
    location: "Oran Açıkhava",
    date: "20 Haziran 2025",
    price: "1100 TL",
    image: "https://via.placeholder.com/300x180?text=Ajda+Pekkan",
  },
  {
    title: "Yaşar",
    location: "ODTÜ MD",
    date: "31 Mayıs 2025",
    price: "700 TL",
    image: "https://via.placeholder.com/300x180?text=Yaşar",
  },
  {
    title: "Mahmut Orhan",
    location: "Garden Music Hall",
    date: "01 Haziran 2025",
    price: "850 TL",
    image: "https://via.placeholder.com/300x180?text=Mahmut+Orhan",
  },
  {
    title: "Edis",
    location: "Ankara Arena",
    date: "15 Mayıs 2025",
    price: "950 TL",
    image: "https://via.placeholder.com/300x180?text=Edis",
  },
  {
    title: "Hadise",
    location: "Next Level AVM",
    date: "28 Mayıs 2025",
    price: "1000 TL",
    image: "https://via.placeholder.com/300x180?text=Hadise",
  },
];

function MainPage() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h4">Biletinyo</Typography>
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Etkinlik, sanatçı veya mekan arayın..."
              size="small"
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit">Üye Girişi</Button>
            <Button color="inherit" variant="outlined">
              Üye Ol
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 10 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
          justifyContent="center"
        >
          <Chip label="Konser" color="primary" clickable />
          <Chip label="Tiyatro" color="primary" clickable />
          <Chip label="Festival" color="primary" clickable />
          <Chip label="Spor" color="primary" clickable />
        </Stack>

        <Grid container spacing={3} justifyContent="center">
          {exampleEvents.map((event, i) => (
            <Grid item key={i}>
              <Card
                sx={{
                  width: 350,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={event.image}
                  alt={event.title}
                  sx={{ height: 180, objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location} – {event.date}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    {event.price}
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

export default MainPage;
