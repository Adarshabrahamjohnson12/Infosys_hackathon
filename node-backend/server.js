// File: server.js

const express = require('express');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');




const app = express();
const upload = multer();
app.use(express.json()); // For JSON POST

// === Serve static files ===
app.use(express.static('public'));

// === STATIC ROUTES ===

app.get('/host', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/host/index.html'));
});

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/user/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/index.html'));
});

// Home
app.get('/', (req, res) => {
  res.send('<h1>Village Stay - Choose: <a href="/host">Host</a> | <a href="/user">User</a> | <a href="/admin">Admin</a></h1>');
});

// === AI ROUTES ===

app.post('/api/image-quality', upload.single('stayImage'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('http://localhost:5003/image-quality', formData, {
      headers: formData.getHeaders()
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Image Quality Check Failed' });
  }
});

app.post('/api/fraud-check', upload.single('stayImage'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('http://localhost:5004/fraud-check', formData, {
      headers: formData.getHeaders()
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Fraud Check Failed' });
  }
});

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post('http://localhost:5005/chatbot', { message });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Chatbot Failed' });
  }
});

// === NEW: Host Save ===
app.post('/api/host/upload', upload.single('stayImage'), (req, res) => {
  try {
    const stays = JSON.parse(fs.readFileSync('stays.json'));
    const newStay = {
      id: Date.now(),
      name: req.body.stayName,
      description: req.body.description,
      image: req.file ? req.file.originalname : null,
      flagged: false
    };
    stays.push(newStay);
    fs.writeFileSync('stays.json', JSON.stringify(stays, null, 2));
    res.json({ msg: '✅ Stay listed!', stay: newStay });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to save stay.' });
  }
});

// === NEW: User Get Stays ===
app.get('/api/stays', (req, res) => {
  try {
    const stays = JSON.parse(fs.readFileSync('stays.json'));
    res.json(stays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to load stays.' });
  }
});

// === NEW: User Book Stay ===
app.post('/api/book', (req, res) => {
  try {
    const bookings = JSON.parse(fs.readFileSync('bookings.json'));
    const newBooking = {
      stayId: req.body.stayId,
      userName: req.body.userName,
      date: req.body.date
    };
    bookings.push(newBooking);
    fs.writeFileSync('bookings.json', JSON.stringify(bookings, null, 2));
    res.json({ msg: '✅ Booking confirmed!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Failed to save booking.' });
  }
});

// Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Node server running → http://localhost:${PORT}`);
});
