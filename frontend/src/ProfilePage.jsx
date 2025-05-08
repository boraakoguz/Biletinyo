import {
  Avatar,
  Box,
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function ProfilePage() {
  const navigate = useNavigate();
  const viewTicket = (ticketId) => navigate(`/ticket/${ticketId}`);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // or navigate("/login") if you prefer
  };
  const rows = [
    {
      id: "101",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9rPoOy-JnLdYc9O8BubM4URYh_N8BNOO8hQ&s",
      name: "BOOM CONCERT",
      location: "BOOM CITY",
      date: "15.04.2025",
      time: "15:00",
      guest: 2,
    },
    {
      id: "102",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKpMysp9ltSCrNetbD7nYWn2N3NNPl97nZyg&s",
      name: "YALIN",
      location: "CERNMODERN",
      date: "15.04.2025",
      time: "15:00",
      guest: 3,
    },
  ];

  return (
    <Box position="relative" sx={{ backgroundColor: "gray" }}>
      <Grid container spacing={0} sx={{ height: "80%" }}>
        <Grid
          size={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: "40px",
              width: "60%",
              height: "70%",
              padding: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "20%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                backgroundColor: "#002fa7",
              }}
            >
              <Typography color="white" variant="h4">
                Profile Page
              </Typography>
            </Paper>
            <Box
              sx={{
                marginTop: "15px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "70%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" marginTop={"20px"}>
                Name
              </Typography>
              <Typography variant="h5">Ege</Typography>
              <Typography variant="h4" marginTop={"20px"}>
                E-Mail
              </Typography>
              <Typography variant="h5">email</Typography>
              <Typography variant="h4" marginTop={"20px"}>
                Birth Year
              </Typography>
              <Typography variant="h5">2004</Typography>
              <Typography variant="h4" marginTop={"20px"}>
                Phone
              </Typography>
              <Typography variant="h5">532</Typography>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid
          size={8}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: "40px",
              width: "80%",
              height: "70%",
              padding: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                width: "100%",
                borderRadius: "20px",
                height: "15%",
                padding: "30px",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#002fa7",
              }}
            >
              <Typography color="white" variant="h4">
                Digital Tickets
              </Typography>
            </Paper>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "20px",
                marginTop: "15px",
                minHeight: "auto",
                maxHeight: "85%",
              }}
            >
              <Table component={Paper} sx={{}}>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        marginTop: "10px",
                        borderRadius: "20px",
                      }}
                    >
                      <TableCell width={"30%"} align="left">
                        <Box width={"100%"} height={"100%"}>
                          <Avatar
                            variant="square"
                            src={row.image}
                            sx={{ width: "100%", height: "100%" }}
                          ></Avatar>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            minWidth: "40%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                          }}
                        >
                          <Box
                            sx={{
                              marginLeft: "15px",
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              minWidth: "50%",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="h5">{row.name}</Typography>
                            <Typography variant="body1">
                              {row.location}
                            </Typography>
                            <Typography variant="body1">{row.date}</Typography>
                            <Typography variant="body1">{row.time}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>Guest Number: {row.guest}</Typography>
                      </TableCell>
                      <TableCell align="right" width={"10%"}>
                        <Button
                          variant="outlined"
                          onClick={() => viewTicket(row.id)}
                        >
                          View Ticket
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
