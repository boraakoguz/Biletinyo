// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#002fa7",       
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF9800",       
    },
    background: {
      default: "#F9FAFB",    
    },
    error: {
      main: "#F44336",
    },
    success: {
      main: "#4CAF50",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    button: {
      textTransform: "none", 
    },
  },
});

export default theme;