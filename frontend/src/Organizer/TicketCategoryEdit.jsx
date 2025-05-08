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
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#e57373",
  "#64b5f6",
  "#81c784",
  "#fff176",
  "#ba68c8",
  "#4db6ac",
];

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

  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: "", capacity: "", price: "" });
  const [selectedCat, setSelectedCat] = useState("");
  const [assignments, setAssignments] = useState({});
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    // Dummy categories
    const cats = [
      { category_name: "VIP", category_capacity: 10, price: 500 },
      { category_name: "Normal", category_capacity: 50, price: 200 },
      { category_name: "Artist Pass", category_capacity: 5, price: 1000 },
    ];
    setCategories(cats);
    setSelectedCat(cats[0].category_name);
    setAssignments({});
  }, []);

  const handleAddCat = () => {
    if (!newCat.name || !newCat.capacity || !newCat.price) return;
    const created = {
      category_name: newCat.name,
      category_capacity: Number(newCat.capacity),
      price: Number(newCat.price),
    };
    setCategories(prev => [...prev, created]);
    setNewCat({ name: "", capacity: "", price: "" });
    setSelectedCat(created.category_name);
  };

  const handleDeleteCat = name => {
    setCategories(prev => prev.filter(c => c.category_name !== name));
    setAssignments(prev => {
      const out = { ...prev };
      Object.keys(out).forEach(k => out[k] === name && delete out[k]);
      return out;
    });
  };

  const toggleSeat = (row, col) => {
    const key = `${row}-${col}`;
    setAssignments(prev => ({
      ...prev,
      [key]: prev[key] === selectedCat ? null : selectedCat,
    }));
  };

  const assignSeat = (row, col) => {
    const key = `${row}-${col}`;
    setAssignments(prev => ({ ...prev, [key]: selectedCat }));
  };

  const handleSave = () => {
    const counts = {};
    Object.values(assignments).forEach(cat => {
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    const exceeded = categories.find(
      c => counts[c.category_name] > c.category_capacity
    );
    if (exceeded) {
      alert(
        `${exceeded.category_name} kapasite aşıldı: max ${exceeded.category_capacity}, seçilen ${counts[exceeded.category_name]}`
      );
      // remove extras
      setAssignments(prev => {
        const out = { ...prev };
        let seen = 0;
        Object.keys(out).forEach(k => {
          if (out[k] === exceeded.category_name) {
            seen++;
            if (seen > exceeded.category_capacity) out[k] = null;
          }
        });
        return out;
      });
      return;
    }
    console.log(assignments);
    alert("Kayıt tamamlandı (mock)");
  };

  const rows = 10;
  const cols = 10;

  return (
    <>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            sx={{ fontStyle: "italic", fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Biletinyo
          </Typography>
          <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
            <TextField
              fullWidth size="small" placeholder="Etkinlik, mekan ya da sanatçı arayın..."
              sx={{ backgroundColor: "white", borderRadius: 3, '& .MuiOutlinedInput-root fieldset': { border: 'none' } }}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={() => navigate("/login")} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>Üye Girişi</Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate("/signin")} sx={{ borderColor: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>Üye Ol</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ my: 4 }} onMouseUp={() => setDragging(false)}>
        <Typography variant="h4" gutterBottom>Bilet Kategorileri</Typography>
        <Paper sx={{ p: 2, mb: 4 }}>
          <Stack spacing={2}>
            <TextField label="Kategori Adı" value={newCat.name} onChange={e => setNewCat(n => ({ ...n, name: e.target.value }))} fullWidth />
            <TextField label="Kapasite" type="number" value={newCat.capacity} onChange={e => setNewCat(n => ({ ...n, capacity: e.target.value }))} fullWidth />
            <TextField label="Fiyat (TL)" type="number" value={newCat.price} onChange={e => setNewCat(n => ({ ...n, price: e.target.value }))} fullWidth />
            <Button variant="contained" onClick={handleAddCat}>Kategori Ekle</Button>
          </Stack>
        </Paper>
        <Grid container spacing={2} mb={4}>
          {categories.map((c,i)=>(
            <Grid item xs={12} sm={6} md={4} key={c.category_name}>
              <Card sx={{boxShadow:2}}><CardContent>
                <Typography variant="h6">{c.category_name}</Typography>
                <Typography>Kontenjan: {c.category_capacity}</Typography>
                <Typography>Fiyat: {c.price} TL</Typography>
                <Button size="small" color="error" sx={{mt:1}} onClick={()=>handleDeleteCat(c.category_name)}>Sil</Button>
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom>Oturma Planı & Kategori Atama</Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Select value={selectedCat} onChange={e=>setSelectedCat(e.target.value)} size="small">
            {categories.map((c,i)=>(<MenuItem key={c.category_name} value={c.category_name}><Box component="span" sx={{width:16,height:16,bgcolor:COLORS[i%COLORS.length],display:'inline-block',borderRadius:0.5,mr:1}}/> {c.category_name}</MenuItem>))}
          </Select>
          <Button variant="contained" onClick={handleSave}>Kaydet</Button>
        </Stack>
        <Paper sx={{p:3}}>
          <Box sx={{display:'flex',justifyContent:'center'}}>
            <Box sx={{width:'fit-content'}}>
              <Grid container direction="column" spacing={1}>
                {Array.from({length:rows}).map((_,r)=>(
                  <Grid container item spacing={1} key={r} alignItems="center">
                    <Grid item><Typography>{toRowLabel(r+1)}</Typography></Grid>
                    {Array.from({length:cols}).map((_,c)=>{
                      const key=`${r+1}-${c+1}`;
                      const idx=categories.findIndex(x=>x.category_name===assignments[key]);
                      const bg=idx>=0?COLORS[idx%COLORS.length]:'#eee';
                      return (
                        <Grid item key={key}>
                          <Box
                            onMouseDown={e=>{e.preventDefault(); setDragging(true); toggleSeat(r+1,c+1);}}
                            onMouseEnter={()=>dragging&&assignSeat(r+1,c+1)}
                            sx={{width:40,height:40,display:'flex',alignItems:'center',justifyContent:'center',bgcolor:bg,border:'1px solid #999',borderRadius:1,cursor:'pointer','&:hover':{opacity:0.8},userSelect:'none'}}
                          ><EventSeatIcon fontSize="small"/></Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ))}
                <Grid container item spacing={1} justifyContent="center" mt={2}>
                  <Grid item sx={{width:30}}/>
                  {Array.from({length:cols}).map((_,c)=>(<Grid item key={`col${c}`}><Typography align="center" width={40}>{c+1}</Typography></Grid>))}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
