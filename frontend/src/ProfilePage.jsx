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

import React from "react";

function ProfilePage() {
  const rows = [
    {
      image: 1,
      name: "Ege",
      location: "Ertem",
    },
    {
      image: 2,
      name: "Bora",
      location: "Akoğuz",
    },
    {
      image: 3,
      name: "Can",
      location: "Kütükoğlu",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#002fa7" }}>
      <Grid container spacing={0}>
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
              width: "60%",
              height: "auto",
              padding: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "40%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ width: "200px", height: "200px" }}>Ege</Avatar>
            </Box>
            <Box
              sx={{
                marginTop: "15px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "70%",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Profile Page</Typography>
              <Typography variant="h5">Name</Typography>
              <Typography variant="body">Ege</Typography>
              <Typography variant="h5">E-Mail</Typography>
              <Typography variant="body">email</Typography>
              <Typography variant="h5">Birth Year</Typography>
              <Typography variant="body">2004</Typography>
              <Typography variant="h5">Phone</Typography>
              <Typography variant="body">532</Typography>
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
              width: "80%",
              height: "70%",
              padding: "30px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={5}
              sx={{
                width: "100%",
                height: "15%",
                padding: "30px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">Digital Tickets</Typography>
            </Paper>
            <TableContainer
              component={Paper}
              sx={{
                marginTop: "15px",
                minHeight: "85%",
                maxHeight: "85%",
                padding: "15px",
              }}
            >
              <Table component={Paper} sx={{}}>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        marginTop: "10px",
                      }}
                    >
                      <TableCell width={"15%"} align="left">
                        <Box width={"100%"} height={"100%"}>
                          <Avatar sx={{ width: "100%", height: "100%" }}>
                            Hey
                          </Avatar>
                        </Box>
                      </TableCell>
                      <TableCell width={"75%"}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <Box
                            sx={{
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="body1">Name:</Typography>
                            <Typography variant="body1">Location:</Typography>
                          </Box>
                          <Box
                            sx={{
                              marginLeft: "15px",
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                              minWidth: "30%",
                              flexDirection: "column",
                            }}
                          >
                            <Typography variant="body1">{row.name}</Typography>
                            <Typography variant="body1">
                              {row.location}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right" width={"10%"}>
                        <Button variant="outlined">View Ticket</Button>
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
