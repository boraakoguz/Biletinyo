import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";

function MainPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/applications")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
      })
      .then(setApplications)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Student Applications
      </Typography>

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error.message}
        </Alert>
      )}

      <List>
        {applications.map((app, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${app.sname} (${app.sid})`}
              secondary={`Applied to ${app.cname} (${app.cid})`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default MainPage;
