const test = require('node:test');
const assert = require('node:assert');
const { calculateHeatmap, getTopPicks } = require('./schedule');

test('calculateHeatmap menghitung skor dan vote dengan benar', () => {
  const participants = [
    { name: 'Nadya', votes: { '2026-11-07_19:00': 'g', '2026-11-07_20:00': 'y' } },
    { name: 'Elga', votes: { '2026-11-07_19:00': 'g', '2026-11-07_20:00': 'r' } },
    { name: 'Lea', votes: { '2026-11-07_19:00': 'y', '2026-11-07_20:00': 'g' } }
  ];

  const heatmap = calculateHeatmap(participants);

  // Slot 19:00: 2 'g' (4pts) + 1 'y' (1pt) = 5 pts, 2 'g', 1 'y', 0 'r'
  assert.strictEqual(heatmap['2026-11-07_19:00'].score, 5);
  assert.strictEqual(heatmap['2026-11-07_19:00'].g, 2);
  assert.strictEqual(heatmap['2026-11-07_19:00'].y, 1);

  // Slot 20:00: 1 'y' (1pt) + 1 'r' (0pts) + 1 'g' (2pts) = 3 pts
  assert.strictEqual(heatmap['2026-11-07_20:00'].score, 3);
});

test('getTopPicks mengembalikan urutan slot terbaik (Top 3)', () => {
  const heatmap = {
    'slot_A': { g: 1, y: 0, r: 2, score: 2 },
    'slot_B': { g: 3, y: 0, r: 0, score: 6 },
    'slot_C': { g: 2, y: 1, r: 0, score: 5 },
    'slot_D': { g: 0, y: 0, r: 3, score: 0 }
  };

  const topPicks = getTopPicks(heatmap, 3);

  assert.strictEqual(topPicks.length, 3);
  assert.strictEqual(topPicks[0].slot, 'slot_B'); // Skor 6
  assert.strictEqual(topPicks[1].slot, 'slot_C'); // Skor 5
  assert.strictEqual(topPicks[2].slot, 'slot_A'); // Skor 2
});

test('Kasus Tepi: peserta tunggal dan skor seri', () => {
  // Peserta tunggal
  const singleParticipant = [
    { name: 'Nadya', votes: { '2026-11-07_18:00': 'g' } }
  ];
  const hmSingle = calculateHeatmap(singleParticipant);
  const topSingle = getTopPicks(hmSingle);
  assert.strictEqual(topSingle.length, 1);
  assert.strictEqual(topSingle[0].slot, '2026-11-07_18:00');
  assert.strictEqual(topSingle[0].score, 2);

  // Skor seri (tie-breaking: diuji urutan skor dan freeCount)
  const tieHeatmap = {
    'slot_1': { g: 1, y: 1, r: 0, score: 3 }, // 1 'g'
    'slot_2': { g: 2, y: 0, r: 1, score: 4 }  // 2 'g' (skor lebih tinggi)
  };
  const topTie = getTopPicks(tieHeatmap, 2);
  assert.strictEqual(topTie[0].slot, 'slot_2');
});
