import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((res) => setTimeout(res, 2000));

    console.log("Logged in with", { email, password });
    setLoading(false);
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
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            <Button type="button" variant="text" color="zort">
              Forgot Password?
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
export default LoginPage;
