export default async function decorate(block) {
  const rows = [...block.children];
  const items = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const title = cols[0]?.textContent.trim() || '';
    const category = cols[1]?.textContent.trim() || '';
    const description = cols[2]?.textContent.trim() || '';
    const icon = cols[3]?.textContent.trim() || 'lightbulb';

    items.push({
      title, category, description, icon,
    });
  });

  block.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'opportunities-list';

  const header = document.createElement('div');
  header.className = 'opportunities-header';
  header.innerHTML = `
    <div class="opportunities-title">Latest Opportunities</div>
    <div class="opportunities-subtitle">Recommended actions to improve AI visibility</div>
  `;
  container.appendChild(header);

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'opportunity-card';

    const iconMap = {
      lightbulb: '💡',
      rocket: '🚀',
      target: '🎯',
      chart: '📊',
      globe: '🌐',
      code: '⚙️',
      content: '📝',
      speed: '⚡',
    };

    card.innerHTML = `
      <div class="opportunity-icon">${iconMap[item.icon] || '💡'}</div>
      <div class="opportunity-content">
        <div class="opportunity-item-title">${item.title}</div>
        <div class="opportunity-category">${item.category}</div>
        <div class="opportunity-description">${item.description}</div>
      </div>
      <div class="opportunity-arrow">›</div>
    `;
    container.appendChild(card);
  });

  block.appendChild(container);
}
