import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from "@mui/material";

export default function AdminViewProfile() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/users/profiles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profiles");
        return res.json();
      })
      .then((data) => setProfiles(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        User Profiles
      </Typography>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Birth Date</strong>
              </TableCell>
              <TableCell>
                <strong>Account Balance</strong>
              </TableCell>
              <TableCell>
                <strong>Events Attended</strong>
              </TableCell>
              <TableCell>
                <strong>Organization</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.user_id}>
                <TableCell>{profile.name}</TableCell>
                <TableCell>{profile.email}</TableCell>
                <TableCell>
                  <Chip
                    label={profile.user_role}
                    color={
                      profile.user_role === "admin"
                        ? "error"
                        : profile.user_role === "organizer"
                        ? "primary"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>{profile.phone}</TableCell>
                <TableCell>{profile.birth_date}</TableCell>
                <TableCell>
                  {profile.account_balance != null
                    ? `${profile.account_balance.toFixed(2)} ₺`
                    : "-"}
                </TableCell>
                <TableCell>
                  {profile.attended_event_count != null
                    ? profile.attended_event_count
                    : "-"}
                </TableCell>
                <TableCell>{profile.organization_name || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
