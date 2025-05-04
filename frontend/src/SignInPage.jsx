import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Select,
  FormControl,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

function SignInPage() {
  const [role, setRole] = useState("attendee");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - i - 18); // 80 years back
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    contact: "",
    organization: "",
    birthDate: 0,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering:", { ...formData, role });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#002fa7",
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h1"
              display="inline"
              sx={{
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#002fa7",
                textDecoration: "underline",
              }}
            >
              Biletinyo
            </Typography>
            <Typography variant="h4" color="#002fa7">
              Sign In
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" mb={3}>
            <RadioGroup
              row
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel
                value="attendee"
                control={<Radio />}
                label="Attendee"
              />
              <FormControlLabel
                value="organizer"
                control={<Radio />}
                label="Organizer"
              />
            </RadioGroup>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item size={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item size={6}>
                <TextField
                  fullWidth
                  label="Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item size={6}>
                <TextField
                  fullWidth
                  label="E‑Mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item size={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {role === "attendee" && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    id="birth-date"
                    name="birthDate"
                    label="Birth Date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}

              {role === "organizer" && (
                <Grid item size={6}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}
              <Grid item size={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid item size={12} sx={{ mt: 2 }}>
              <Button fullWidth type="submit" variant="contained">
                REGISTER
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignInPage;
