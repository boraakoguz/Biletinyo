import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Stack,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useNavigate } from "react-router-dom";

const COLORS = ["#e57373", "#64b5f6", "#81c784"];

function toRowLabel(n) {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export default function TicketCategoryEdit() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState({});
  const [prices, setPrices] = useState({ cat1: "", cat2: "", cat3: "" });
  const [dragging, setDragging] = useState(false);

  const categories = [
    { name: "Category 1", color: COLORS[0] },
    { name: "Category 2", color: COLORS[1] },
    { name: "Category 3", color: COLORS[2] },
  ];

  const [selectedCat, setSelectedCat] = useState(categories[0].name);

  const rows = 10;
  const cols = 10;

  const toggleSeat = (row, col) => {
    const key = `${row}-${col}`;
    setAssignments((prev) => ({
      ...prev,
      [key]: prev[key] === selectedCat ? null : selectedCat,
    }));
  };

  const assignSeat = (row, col) => {
    const key = `${row}-${col}`;
    setAssignments((prev) => ({ ...prev, [key]: selectedCat }));
  };

  const handleSave = () => {
    console.log("Prices:", prices);
    console.log("Assignments:", assignments);
    alert("Saved (mock)");
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{
              fontStyle: "italic",
              fontWeight: "bold",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Etkinlik, mekan ya da sanatçı arayın..."
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                "& .MuiOutlinedInput-root fieldset": { border: "none" },
              }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Giriş
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/signin")}
            >
              Kayıt Ol
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ my: 4 }} onMouseUp={() => setDragging(false)}>
        <Typography variant="h4" gutterBottom>
          Set Ticket Prices
        </Typography>
        <Paper sx={{ p: 2, mb: 4 }}>
          <Stack spacing={2}>
            <TextField
              label="Category 1 Price"
              type="number"
              value={prices.cat1}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat1: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Category 2 Price"
              type="number"
              value={prices.cat2}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat2: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Category 3 Price"
              type="number"
              value={prices.cat3}
              onChange={(e) =>
                setPrices((p) => ({ ...p, cat3: e.target.value }))
              }
              fullWidth
            />
            <Select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              size="small"
            >
              {categories.map((c, i) => (
                <MenuItem key={c.name} value={c.name}>
                  <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 16,
                      bgcolor: c.color,
                      display: "inline-block",
                      borderRadius: 0.5,
                      mr: 1,
                    }}
                  />
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Stack>
        </Paper>

        <Typography variant="h5" gutterBottom>
          Seating Plan
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "fit-content" }}>
              <Grid container direction="column" spacing={1}>
                {Array.from({ length: rows }).map((_, r) => (
                  <Grid container item spacing={1} key={r} alignItems="center">
                    <Grid item>
                      <Typography>{toRowLabel(r + 1)}</Typography>
                    </Grid>
                    {Array.from({ length: cols }).map((_, c) => {
                      const key = `${r + 1}-${c + 1}`;
                      const idx = categories.findIndex(
                        (x) => x.name === assignments[key]
                      );
                      const bg = idx >= 0 ? categories[idx].color : "#eee";
                      return (
                        <Grid item key={key}>
                          <Box
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setDragging(true);
                              toggleSeat(r + 1, c + 1);
                            }}
                            onMouseEnter={() =>
                              dragging && assignSeat(r + 1, c + 1)
                            }
                            sx={{
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: bg,
                              border: "1px solid #999",
                              borderRadius: 1,
                              cursor: "pointer",
                              "&:hover": { opacity: 0.8 },
                              userSelect: "none",
                            }}
                          >
                            <EventSeatIcon fontSize="small" />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ))}
                <Grid container item spacing={1} justifyContent="center" mt={2}>
                  <Grid item sx={{ width: 30 }} />
                  {Array.from({ length: cols }).map((_, c) => (
                    <Grid item key={`col${c}`}>
                      <Typography align="center" width={40}>
                        {c + 1}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
