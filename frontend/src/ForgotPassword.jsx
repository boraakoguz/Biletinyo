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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
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
    try {
      await apiService.sendResetCode(email);
      alert("Code sent to your email.");
      setCooldown(60);
    } catch (error) {
      console.error("Error sending code:", error.message);
      alert("Failed to send code.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleConfirm = async () => {
    if (!code || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.resetPasswordWithToken(code, newPassword);

      if (res.error) {
        alert(res.error);
      } else {
        alert("Password successfully changed.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Reset error:", err.message);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              disabled={loading || !email || cooldown > 0}
            >
              {cooldown > 0
                ? `Send Code (${cooldown}s)`
                : loading
                ? "Sending..."
                : "Send Code"}
            </Button>
            <TextField
              label="Enter Code"
              required
              variant="outlined"
              onChange={(e) => setCode(e.target.value)}
              value={code}
            />
            <TextField
              label="Enter New Password"
              variant="outlined"
              type="password"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleConfirm}
            >
              Confirm
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
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
