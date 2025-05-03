import React from "react";
import { useNavigate } from "react-router-dom";
import {
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CardActionArea,
} from "@mui/material";

const exampleEvents = [
  {
    title: "Duman",
    location: "CerModern",
    date: "02 Mayıs 2025",
    price: "900 TL",
    image: "https://via.placeholder.com/300x180?text=Duman",
    time: "20.00",
  },
  {
    title: "Ajda Pekkan",
    location: "Oran Açıkhava",
    date: "20 Haziran 2025",
    price: "1100 TL",
    image: "https://via.placeholder.com/300x180?text=Ajda+Pekkan",
    time: "19.00",
  },
  {
    title: "Yaşar",
    location: "ODTÜ MD",
    date: "31 Mayıs 2025",
    price: "700 TL",
    image: "https://via.placeholder.com/300x180?text=Yaşar",
    time: "19.00",
  },
  {
    title: "Mahmut Orhan",
    location: "Garden Music Hall",
    date: "01 Haziran 2025",
    price: "850 TL",
    image: "https://via.placeholder.com/300x180?text=Mahmut+Orhan",
    time: "19.00",
  },
  {
    title: "Edis",
    location: "Ankara Arena",
    date: "15 Mayıs 2025",
    price: "950 TL",
    image: "https://via.placeholder.com/300x180?text=Edis",
    time: "19.00",
  },
  {
    title: "Hadise",
    location: "Next Level AVM",
    date: "28 Mayıs 2025",
    price: "1000 TL",
    image: "https://via.placeholder.com/300x180?text=Hadise",
    time: "19.00",
  },
  {
    title: "Tarkan",
    location: "İstanbul Harbiye Açıkhava",
    date: "05 Temmuz 2025",
    price: "1400 TL",
    image: "https://via.placeholder.com/300x180?text=Tarkan",
    time: "19.00",
  },
  {
    title: "Sezen Aksu",
    location: "Bursa Kültürpark",
    date: "22 Haziran 2025",
    price: "1200 TL",
    image: "https://via.placeholder.com/300x180?text=Sezen+Aksu",
    time: "19.00",
  },
  {
    title: "Teoman",
    location: "İzmir Arena",
    date: "17 Mayıs 2025",
    price: "750 TL",
    image: "https://via.placeholder.com/300x180?text=Teoman",
    time: "19.00",
  },
  {
    title: "Zeynep Bastık",
    location: "Antalya Açıkhava",
    date: "08 Haziran 2025",
    price: "900 TL",
    image: "https://via.placeholder.com/300x180?text=Zeynep+Bastık",
    time: "19.00",
  },
  {
    title: "MFÖ",
    location: "Adana Merkez Park",
    date: "25 Haziran 2025",
    price: "800 TL",
    image: "https://via.placeholder.com/300x180?text=MFÖ",
    time: "20.00",
  },
];

function MainPage() {
  const navigate = useNavigate();

  const handleSignInRedirect = () => {
    navigate("/signin");
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const openEvent = (event) => {
    navigate("/event", { state: event });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          boxShadow: 10,
          backgroundColor: "#002fa7",
          color: "white",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            width: "100%",
            maxWidth: 1000,
            px: 6,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textDecoration: "underline",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Biletinyo
          </Typography>

          <Box sx={{ flexGrow: 1, mx: 5, minWidth: 200 }}>
            <TextField
              variant="outlined"
              placeholder="Etkinlik, mekan ya da sanatçı arayın..."
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={handleLoginRedirect}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Üye Girişi
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleSignInRedirect}
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "white",
                },
              }}
            >
              Üye Ol
            </Button>
          </Stack>
        </Box>
      </Box>
      <Container sx={{ mt: 5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 5 }}
          justifyContent="center"
          alignItems="center"
        >
          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Kategori</InputLabel>
            <Select label="Kategori" defaultValue="">
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="konser">Konser</MenuItem>
              <MenuItem value="tiyatro">Tiyatro</MenuItem>
              <MenuItem value="festival">Festival</MenuItem>
              <MenuItem value="sinema">Sinema</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Tarih</InputLabel>
            <Select label="Tarih" defaultValue="">
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="this-week">Bu Hafta</MenuItem>
              <MenuItem value="this-month">Bu Ay</MenuItem>
              <MenuItem value="future">Bu Yıl</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                paddingY: 0,
              },
              "& .MuiSelect-select": {
                paddingTop: "6px",
                paddingBottom: "6px",
                minHeight: "unset",
              },
              "& .MuiInputLabel-root": {
                top: "-10px",
              },
            }}
          >
            <InputLabel>Şehir</InputLabel>
            <Select label="Şehir" defaultValue="">
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="ankara">Ankara</MenuItem>
              <MenuItem value="istanbul">İstanbul</MenuItem>
              <MenuItem value="izmir">İzmir</MenuItem>
              <MenuItem value="bursa">Bursa</MenuItem>
              <MenuItem value="antalya">Antalya</MenuItem>
              <MenuItem value="adana">Adana</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={3} justifyContent="left" mb={3}>
          {exampleEvents.map((event, i) => (
            <Grid item key={i}>
              <Card
                sx={{
                  width: 350,
                  height: 300,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 5,
                }}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => openEvent(event)}
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
                      {event.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default MainPage;
