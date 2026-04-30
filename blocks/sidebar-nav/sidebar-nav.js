export default async function decorate(block) {
  const rows = [...block.children];
  const items = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    const label = cols[0]?.textContent.trim() || '';
    const link = cols[0]?.querySelector('a');
    const href = link?.getAttribute('href') || '#';
    const icon = cols[1]?.textContent.trim() || '';

    items.push({ label: link ? link.textContent.trim() : label, href, icon });
  });

  const currentPath = window.location.pathname;

  block.innerHTML = '';

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  const brand = document.createElement('div');
  brand.className = 'sidebar-brand';
  brand.innerHTML = `
    <svg class="sidebar-logo" viewBox="0 0 30 26" fill="none">
      <path d="M19.5 0H30L19.5 26V0Z" fill="#E1251B"/>
      <path d="M10.5 0H0L10.5 26V0Z" fill="#E1251B"/>
      <path d="M15 9.6L22.1 26H18.2L16 20.8H10.5L15 9.6Z" fill="#E1251B"/>
    </svg>
    <span class="sidebar-title">WKND LLMO</span>
  `;
  sidebar.appendChild(brand);

  const nav = document.createElement('nav');
  nav.className = 'sidebar-menu';
  nav.setAttribute('aria-label', 'Dashboard navigation');

  const iconMap = {
    overview: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></svg>',
    brand: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2.5 2.5"/></svg>',
    domain: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="7"/><path d="M2 10h16"/><ellipse cx="10" cy="10" rx="3" ry="7"/></svg>',
    opportunities: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2l2 5h5l-4 3.5 1.5 5L10 13l-4.5 2.5L7 10.5 3 7h5l2-5z"/></svg>',
    config: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="3"/><path d="M10 2v2m0 12v2m-6-8H2m16 0h-2m-1.2-4.8l-1.4 1.4m-7.8 7.8l-1.4 1.4m0-10.6l1.4 1.4m7.8 7.8l1.4 1.4"/></svg>',
    resources: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h12v14H4z"/><path d="M7 8h6m-6 3h6m-6 3h4"/></svg>',
  };

  items.forEach((item) => {
    const menuItem = document.createElement('a');
    menuItem.className = 'sidebar-item';
    menuItem.href = item.href;

    if (currentPath === item.href || currentPath === `${item.href}/`
      || currentPath.endsWith(`${item.href}.html`)) {
      menuItem.classList.add('active');
      menuItem.setAttribute('aria-current', 'page');
    }

    const iconSvg = iconMap[item.icon] || iconMap.overview;
    menuItem.innerHTML = `
      <span class="sidebar-icon">${iconSvg}</span>
      <span class="sidebar-label">${item.label}</span>
    `;
    nav.appendChild(menuItem);
  });

  sidebar.appendChild(nav);
  block.appendChild(sidebar);

  document.body.classList.add('has-sidebar-nav');
}
