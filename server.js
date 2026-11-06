const express = require('express');
const { calculateHeatmap, getTopPicks } = require('./lib/schedule');

const app = express();
app.use(express.json());

// Mock database / memory store sementara (nanti digabung dengan database Elga)
const mockEvents = {
  'room-123': {
    id: 'room-123',
    title: 'Nongkrong Akhir Pekan',
    participants: [
      { name: 'Nadya', votes: { '2026-11-07_19:00': 'g', '2026-11-07_20:00': 'y' } },
      { name: 'Elga', votes: { '2026-11-07_19:00': 'g', '2026-11-07_20:00': 'r' } },
      { name: 'Lea', votes: { '2026-11-07_19:00': 'y', '2026-11-07_20:00': 'g' } }
    ]
  }
};

/**
 * GET /api/events/:id/results
 * Endpoint tugas Nadya: Mengembalikan hasil perhitungan heatmap dan top picks untuk suatu acara.
 */
app.get('/api/events/:id/results', (req, res) => {
  const { id } = req.params;
  const event = mockEvents[id];

  if (!event) {
    return res.status(404).json({ error: 'Acara tidak ditemukan' });
  }

  // Hitung heatmap dan top picks menggunakan fungsi murni di lib/schedule.js
  const heatmap = calculateHeatmap(event.participants);
  const topPicks = getTopPicks(heatmap, 3);

  return res.json({
    eventId: event.id,
    title: event.title,
    totalParticipants: event.participants.length,
    heatmap,
    topPicks
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Nongki-Yuk berjalan di http://localhost:${PORT}`);
});
