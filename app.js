const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests

const router = express.Router();

// Sample in-memory notes storage
let notes = [];

// Define your routes
router.get('/notes', (req, res) => {
  res.json(notes);
});

router.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const newNote = { id: Date.now().toString(), title, content };
  notes.push(newNote);
  res.json(newNote);
});

// Assuming you are using Express.js
router.put('/notes/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  const noteIndex = notes.findIndex(note => note.id === id);

  if (noteIndex !== -1) {
    // Update the existing note
    notes[noteIndex] = { id, title, content };
    res.json({ message: `Updated note with id ${id}` });
  } else {
    res.status(404).json({ message: `Note with id ${id} not found` });
  }
});




router.delete('/notes/:id', (req, res) => {
  const id = req.params.id;
  const noteIndex = notes.findIndex(note => note.id === id);

  if (noteIndex !== -1) {
    // Remove the note
    notes.splice(noteIndex, 1);
    res.json({ message: `Deleted note with id ${id}` });
  } else {
    res.status(404).json({ message: `Note with id ${id} not found` });
  }
});

app.use(express.static('public')); // Serve static files from the 'public' directory

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
