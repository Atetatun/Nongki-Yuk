/**
 * Logika Inti & Helper untuk Nongki-Yuk
 * Menghitung irisan waktu (heatmap) dan memilih Top Picks (3 opsi terbaik).
 */

/**
 * Menghitung heatmap / irisan ketersediaan dari daftar peserta.
 * @param {Array} participants - Daftar peserta dengan ketersediaannya masing-masing.
 * Contoh participant: { name: 'Nadya', votes: { '2026-11-07_19:00': 'g', '2026-11-07_20:00': 'y' } }
 * State: 'g' = Bisa (2 pts), 'y' = Tentatif (1 pt), 'r' = Ga Bisa (0 pts), '' = Kosong
 * @returns {Object} Rekap skor per slot waktu
 */
function calculateHeatmap(participants) {
  const heatmap = {};

  participants.forEach(p => {
    if (!p.votes) return;
    Object.entries(p.votes).forEach(([slot, state]) => {
      if (!heatmap[slot]) {
        heatmap[slot] = { g: 0, y: 0, r: 0, empty: 0, score: 0 };
      }
      if (state === 'g') {
        heatmap[slot].g += 1;
        heatmap[slot].score += 2;
      } else if (state === 'y') {
        heatmap[slot].y += 1;
        heatmap[slot].score += 1;
      } else if (state === 'r') {
        heatmap[slot].r += 1;
      } else {
        heatmap[slot].empty += 1;
      }
    });
  });

  return heatmap;
}

/**
 * Memilih 3 opsi jadwal terbaik (Top Picks) berdasarkan skor tertinggi.
 * @param {Object} heatmap - Hasil dari calculateHeatmap
 * @param {number} limit - Jumlah top picks yang diinginkan (default 3)
 * @returns {Array} Daftar slot waktu terbaik yang diurutkan dari skor tertinggi
 */
function getTopPicks(heatmap, limit = 3) {
  const slots = Object.entries(heatmap).map(([slot, data]) => ({
    slot,
    score: data.score,
    freeCount: data.g,
    maybeCount: data.y,
    busyCount: data.r
  }));

  // Urutkan berdasarkan skor tertinggi (descending), lalu jumlah 'g' terbanyak
  slots.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.freeCount - a.freeCount;
  });

  return slots.slice(0, limit);
}

module.exports = {
  calculateHeatmap,
  getTopPicks
};
