function createBarChart(data, options = {}) {
  const { title, subtitle, legends } = options;
  const maxVal = Math.max(...data.flatMap((d) => d.values));
  const barHeight = 32;
  const gap = 16;
  const chartHeight = data.length * (barHeight + gap);
  const colors = ['#1473e6', '#0d9a6c', '#e68619', '#d83a00'];

  let html = '<div class="chart-container">';
  html += `<div class="chart-header"><div class="chart-title">${title}</div>`;
  if (subtitle) html += `<div class="chart-subtitle">${subtitle}</div>`;
  html += '</div>';

  if (legends && legends.length) {
    html += '<div class="chart-legend">';
    legends.forEach((l, i) => {
      html += `<span class="chart-legend-item"><span class="chart-legend-dot" style="background:${colors[i]}"></span>${l}</span>`;
    });
    html += '</div>';
  }

  html += `<div class="chart-bars" style="height:${chartHeight}px">`;
  data.forEach((item) => {
    html += `<div class="chart-bar-row">
      <div class="chart-bar-label">${item.label}</div>
      <div class="chart-bar-tracks">`;
    item.values.forEach((v, i) => {
      const pct = (v / maxVal) * 100;
      html += `<div class="chart-bar-segment" style="width:${pct}%;background:${colors[i]}"></div>`;
    });
    html += `</div>
      <div class="chart-bar-value">${item.values.reduce((a, b) => a + b, 0)}</div>
    </div>`;
  });
  html += '</div></div>';
  return html;
}

function createLineChart(data, options = {}) {
  const { title, subtitle, legends } = options;
  const width = 400;
  const height = 180;
  const padding = 30;
  const colors = ['#1473e6', '#9256d9'];

  const allValues = data.series.flatMap((s) => s.values);
  const max = Math.max(...allValues);
  const min = 0;
  const range = max - min || 1;

  let svg = `<svg viewBox="0 0 ${width} ${height}" class="chart-line-svg">`;

  // grid lines
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - 2 * padding) * i) / 4;
    const val = Math.round(max - (i * max) / 4);
    svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e8e8e8" stroke-width="1"/>`;
    svg += `<text x="${padding - 5}" y="${y + 4}" text-anchor="end" font-size="10" fill="#6e6e6e">${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}</text>`;
  }

  // x labels
  data.labels.forEach((label, i) => {
    const x = padding + (i / (data.labels.length - 1)) * (width - 2 * padding);
    svg += `<text x="${x}" y="${height - 5}" text-anchor="middle" font-size="10" fill="#6e6e6e">${label}</text>`;
  });

  // lines
  data.series.forEach((series, si) => {
    const points = series.values.map((v, i) => {
      const x = padding + (i / (series.values.length - 1)) * (width - 2 * padding);
      const y = padding + ((max - v) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');
    svg += `<polyline points="${points}" fill="none" stroke="${colors[si]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  });

  svg += '</svg>';

  let html = '<div class="chart-container">';
  html += `<div class="chart-header"><div class="chart-title">${title}</div>`;
  if (subtitle) html += `<div class="chart-subtitle">${subtitle}</div>`;
  html += '</div>';

  if (legends && legends.length) {
    html += '<div class="chart-legend">';
    legends.forEach((l, i) => {
      html += `<span class="chart-legend-item"><span class="chart-legend-dot" style="background:${colors[i]}"></span>${l}</span>`;
    });
    html += '</div>';
  }

  html += svg;
  html += '</div>';
  return html;
}

function createStackedBarChart(data, options = {}) {
  const { title, subtitle, legends } = options;
  const colors = ['#d83a00', '#b3b3b3', '#0d9a6c'];
  const barWidth = 60;
  const height = 180;
  const padding = 30;

  let svg = `<svg viewBox="0 0 ${data.labels.length * (barWidth + 20) + 2 * padding} ${height + 40}" class="chart-stacked-svg">`;

  // y-axis labels
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + ((height - padding) * i) / 4;
    const val = 100 - i * 25;
    svg += `<line x1="${padding}" y1="${y}" x2="${data.labels.length * (barWidth + 20) + padding}" y2="${y}" stroke="#e8e8e8" stroke-width="1"/>`;
    svg += `<text x="${padding - 5}" y="${y + 4}" text-anchor="end" font-size="10" fill="#6e6e6e">${val}%</text>`;
  }

  data.stacks.forEach((stack, i) => {
    const x = padding + i * (barWidth + 20);
    let currentY = padding;
    const total = stack.reduce((a, b) => a + b, 0);

    stack.forEach((val, si) => {
      const segHeight = (val / total) * (height - padding);
      svg += `<rect x="${x}" y="${currentY}" width="${barWidth}" height="${segHeight}" fill="${colors[si]}" rx="2"/>`;
      currentY += segHeight;
    });

    svg += `<text x="${x + barWidth / 2}" y="${height + 15}" text-anchor="middle" font-size="10" fill="#6e6e6e">${data.labels[i]}</text>`;
  });

  svg += '</svg>';

  let html = '<div class="chart-container">';
  html += `<div class="chart-header"><div class="chart-title">${title}</div>`;
  if (subtitle) html += `<div class="chart-subtitle">${subtitle}</div>`;
  html += '</div>';

  if (legends && legends.length) {
    html += '<div class="chart-legend">';
    legends.forEach((l, i) => {
      html += `<span class="chart-legend-item"><span class="chart-legend-dot" style="background:${colors[i]}"></span>${l}</span>`;
    });
    html += '</div>';
  }

  html += svg;
  html += '</div>';
  return html;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const chartType = rows[0]?.children[0]?.textContent.trim().toLowerCase() || 'bar';
  const dataSource = rows[0]?.children[1]?.textContent.trim() || '';

  block.innerHTML = '<div class="chart-loading">Loading chart...</div>';

  try {
    const resp = await fetch(dataSource);
    const json = await resp.json();

    block.innerHTML = '';

    if (chartType === 'bar' || chartType === 'horizontal-bar') {
      block.innerHTML = createBarChart(json.data, json.options || {});
    } else if (chartType === 'line') {
      block.innerHTML = createLineChart(json.data, json.options || {});
    } else if (chartType === 'stacked-bar') {
      block.innerHTML = createStackedBarChart(json.data, json.options || {});
    }
  } catch (e) {
    block.innerHTML = '<div class="chart-error">Unable to load chart data</div>';
  }
}
