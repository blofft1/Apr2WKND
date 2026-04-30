export default async function decorate(block) {
  const rows = [...block.children];
  const score = parseInt(rows[0]?.children[0]?.textContent.trim(), 10) || 0;
  const label = rows[0]?.children[1]?.textContent.trim() || 'Content Visibility';
  const status = rows[1]?.children[0]?.textContent.trim() || '';
  const message = rows[1]?.children[1]?.textContent.trim() || '';
  const cta = rows[2]?.children[0]?.textContent.trim() || '';

  let statusClass = 'poor';
  if (score >= 70) statusClass = 'good';
  else if (score >= 40) statusClass = 'fair';

  const radius = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference * 0.75;
  const rotation = 135;

  block.innerHTML = `
    <div class="gauge-card">
      <div class="gauge-visual">
        <svg class="gauge-ring" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="${radius}" fill="none" stroke="#f0f0f0" stroke-width="${stroke}"
            stroke-dasharray="${circumference * 0.75} ${circumference * 0.25}"
            transform="rotate(${rotation} 90 90)" stroke-linecap="round"/>
          <circle cx="90" cy="90" r="${radius}" fill="none" stroke="var(--gauge-color)" stroke-width="${stroke}"
            stroke-dasharray="${circumference * 0.75 - dashOffset} ${circumference - (circumference * 0.75 - dashOffset)}"
            transform="rotate(${rotation} 90 90)" stroke-linecap="round"
            class="gauge-progress"/>
        </svg>
        <div class="gauge-value">
          <span class="gauge-number">${score}%</span>
          <span class="gauge-label">${label}</span>
        </div>
      </div>
      <div class="gauge-info ${statusClass}">
        <div class="gauge-status">${status}</div>
        <div class="gauge-message">${message}</div>
        ${cta ? `<button class="gauge-cta">${cta}</button>` : ''}
      </div>
    </div>
  `;
}
