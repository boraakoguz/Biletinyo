import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "./apiService";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiService.login({ email, password });

      if (!data.access_token) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged in user:", data.user);
      console.log("Logged in user:", data.access_token);
      if (data.user.user_type === 1) {
        navigate("/organizer/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
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
        backgroundColor: " #002fa7",
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
              Login
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              variant="outlined"
              type={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={"password"}
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="text" color="zort">
              Forgot Password?
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
export default LoginPage;
