import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import apiService from "./apiService";

function SignInPage() {
  const [role, setRole] = useState("attendee");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    organization: "",
    birthDate: 0,
  });
  const [countryCode, setCountryCode] = useState("+90");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const countryOptions = [
    { code: "+1", label: "🇺🇸 +1 (USA)" },
    { code: "+44", label: "🇬🇧 +44 (UK)" },
    { code: "+90", label: "🇹🇷 +90 (Turkey)" },
    { code: "+49", label: "🇩🇪 +49 (Germany)" },
    { code: "+33", label: "🇫🇷 +33 (France)" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
    validatePhone(countryCode, e.target.value);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
    validatePhone(e.target.value, phoneNumber);
  };

  // Phone validation: require country code and 6-14 digits
  const validatePhone = (code, number) => {
    const phoneRegex = /^\d{6,14}$/;
    if (!phoneRegex.test(number)) {
      setPhoneError(
        "Enter a valid contact number (6-14 digits, no spaces or dashes)"
      );
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  const handleTabChange = (event, newValue) => {
    setRole(newValue);
    // Clear organization name if switching to attendee
    if (newValue === "attendee") {
      setFormData((prev) => ({ ...prev, organization: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      user_type: role === "organizer" ? 1 : 0,
      phone: countryCode + phoneNumber,
      birth_date: formData.birthDate,
      organization_name: role === "organizer" ? formData.organization : null,
    };

    try {
      const data = await apiService.register(userData);

      if (data.error) {
        throw new Error(data.error);
      }

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#002fa7",
        py: 6,
      }}
    >
      <Container sx={{ width: "40%" }}>
        <Paper elevation={3} sx={{ p: 4, mt: 2, mb: 2, borderRadius: 3 }}>
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

          {/* Sliding Tabs for Attendee/Organizer */}
          <Tabs
            value={role}
            onChange={handleTabChange}
            centered
            sx={{ mb: 2 }}
            TabIndicatorProps={{ style: { background: "#002fa7" } }}
          >
            <Tab
              label="Attendee"
              value="attendee"
              sx={{
                fontWeight: role === "attendee" ? 700 : 400,
                color: role === "attendee" ? "#002fa7" : "#888",
                fontSize: "1.1rem",
                textTransform: "none",
                minWidth: 120,
              }}
            />
            <Tab
              label="Organizer"
              value="organizer"
              sx={{
                fontWeight: role === "organizer" ? 700 : 400,
                color: role === "organizer" ? "#002fa7" : "#888",
                fontSize: "1.1rem",
                textTransform: "none",
                minWidth: 120,
              }}
            />
          </Tabs>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <TextField
              label="Surname"
              variant="outlined"
              name="surname"
              required
              onChange={handleChange}
              value={formData.surname}
            />
            <TextField
              label="E‑Mail"
              variant="outlined"
              name="email"
              type="email"
              required
              onChange={handleChange}
              value={formData.email}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl sx={{ minWidth: 110, flexShrink: 0 }} required>
                <InputLabel id="country-code-label">Country</InputLabel>
                <Select
                  labelId="country-code-label"
                  id="country-code"
                  value={countryCode}
                  label="Country"
                  onChange={handleCountryCodeChange}
                >
                  {countryOptions.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Contact Number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                required
                placeholder="5551234567"
                error={!!phoneError}
                helperText={phoneError}
                variant="outlined"
              />
            </Box>
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
              variant="outlined"
            />
            {role === "organizer" && (
              <TextField
                label="Organization Name"
                variant="outlined"
                name="organization"
                required
                onChange={handleChange}
                value={formData.organization}
              />
            )}
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              required
              onChange={handleChange}
              value={formData.password}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              name="confirmPassword"
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              disabled={loading}
            >
              REGISTER
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignInPage;
