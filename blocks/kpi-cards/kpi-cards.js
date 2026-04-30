export default async function decorate(block) {
  const rows = [...block.children];
  const cards = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim() || '';
    const value = cols[1]?.textContent.trim() || '';
    const trend = cols[2]?.textContent.trim() || '';
    const sparkData = cols[3]?.textContent.trim() || '';

    cards.push({
      label, value, trend, sparkData,
    });
  });

  block.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'kpi-cards-grid';

  cards.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'kpi-card';

    const trendValue = parseFloat(card.trend);
    let trendClass = 'neutral';
    let trendIcon = '→';
    if (trendValue > 0) { trendClass = 'up'; trendIcon = '↑'; }
    if (trendValue < 0) { trendClass = 'down'; trendIcon = '↓'; }

    const sparkPoints = card.sparkData
      ? card.sparkData.split(',').map((v) => parseFloat(v.trim()))
      : [];

    let sparkSvg = '';
    if (sparkPoints.length > 1) {
      const max = Math.max(...sparkPoints);
      const min = Math.min(...sparkPoints);
      const range = max - min || 1;
      const width = 60;
      const height = 24;
      const points = sparkPoints.map((v, i) => {
        const x = (i / (sparkPoints.length - 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      }).join(' ');
      sparkSvg = `<svg class="kpi-spark" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    }

    cardEl.innerHTML = `
      <div class="kpi-card-label">${card.label}</div>
      <div class="kpi-card-body">
        <div class="kpi-card-value">${card.value}</div>
        ${sparkSvg}
      </div>
      <div class="kpi-card-trend ${trendClass}">
        <span class="kpi-trend-icon">${trendIcon}</span>
        <span>${Math.abs(trendValue)}% vs last week</span>
      </div>
    `;
    container.appendChild(cardEl);
  });

  block.appendChild(container);
}
