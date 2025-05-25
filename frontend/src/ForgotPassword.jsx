import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "./apiService";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    const redirectState = location.state;
    if (redirectState?.message) {
      setMessage(redirectState.message);
    }

    if (token && user) {
      navigate("/", { replace: true });
    }
  }, [navigate, location]);

  const handleSendCode = async () => {
    setLoading(true);
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
      <Container sx={{ width: "40%" }}>
        <Paper elevation={3} sx={{ p: 4 }}>
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
              Forgot Password
            </Typography>
          </Box>

          {message && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              variant="outlined"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendCode}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Code"}
            </Button>
            <TextField
              label="Enter Code"
              variant="outlined"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
            <TextField
              label="Enter New Password"
              variant="outlined"
              type="password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate("/login")}
            >
              Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
export default ForgotPassword;
