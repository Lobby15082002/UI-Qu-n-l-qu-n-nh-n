/* Hệ thống Quản lý Quân nhân — app.js
    */
(function () {
  'use strict';

  const { org, personnel, details, statusBadge } = window.MOCK;

  /* ---------- State ---------- */
  const state = {
    view: 'list',          // 'list' | 'detail'
    unitId: 'dd12',
    personId: null,
    tab: 'profile',
    expanded: new Set(['sd3', 'td1']),
    unitQuery: '',
    listQuery: ''
  };

  const TABS = [
    { key: 'profile', label: 'Sơ yếu lý lịch' },
    { key: 'equipment', label: 'Quân tư trang' },
    { key: 'family', label: 'Gia đình' },
    { key: 'discipline', label: 'Kỷ luật' },
    { key: 'rewards', label: 'Khen thưởng' }
  ];

  /* ---------- Helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<svg class="icon ${cls}"><use href="#i-${name}"/></svg>`;
  const initials = (name) => name.split(' ').filter(Boolean).map((w) => w[0]).slice(-2).join('').toUpperCase();
  const badge = (status) => `<span class="badge badge--${statusBadge[status] || 'info'}">${esc(status)}</span>`;

  function findUnit(id, node = org) {
    if (node.id === id) return node;
    for (const child of node.children || []) {
      const hit = findUnit(id, child);
      if (hit) return hit;
    }
    return null;
  }
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const matches = (text, q) => norm(text).includes(norm(q));

  /* ---------- Render: unit tree ---------- */
  function renderTree() {
    const q = state.unitQuery.trim();

    const nodeHtml = (n) => {
      const hasKids = n.children && n.children.length;
      const open = state.expanded.has(n.id) || (q && subtreeMatches(n, q));
      const selected = n.id === state.unitId;
      const chev = n.type === 'company' ? '' : icon(open ? 'chevron-down' : 'chevron-right');
      const count = n.count != null ? `<span class="unit-node__count">${n.count}</span>` : '';
      let html = `<div class="unit-node unit-node--${n.type}${selected ? ' is-selected' : ''}" role="treeitem" data-unit="${n.id}" data-type="${n.type}">${chev}${esc(n.name)}${count}</div>`;
      if (hasKids && open) {
        html += `<div class="unit-tree__children">${n.children.filter((c) => !q || subtreeMatches(c, q)).map(nodeHtml).join('')}</div>`;
      }
      return html;
    };
    const subtreeMatches = (n, query) => matches(n.name, query) || (n.children || []).some((c) => subtreeMatches(c, query));

    $('unit-tree').innerHTML = nodeHtml(org);
    const battalions = org.children.length;
    const companies = org.children.reduce((s, b) => s + b.children.length, 0);
    $('unit-summary').textContent = `${battalions} tiểu đoàn · ${companies > 9 ? companies : 9} đại đội`;
  }

  /* ---------- Render: personnel list ---------- */
  function renderList() {
    const unit = findUnit(state.unitId);
    const all = personnel[state.unitId] || [];
    const q = state.listQuery.trim();
    const rows = q ? all.filter((p) => matches(p.name + ' ' + p.id, q)) : all;

    $('list-title').textContent = unit.name;
    $('list-count').textContent = `${unit.count ?? all.length} quân nhân`;
    $('list-search').placeholder = `Tìm trong ${unit.name}...`;
    $('table-range').textContent = rows.length ? `Hiển thị 1–${rows.length} / ${unit.count ?? rows.length} quân nhân` : '';

    $('personnel-tbody').innerHTML = rows.length
      ? rows.map((p) => `
        <tr class="table__row" data-person="${p.id}">
          <td class="mono">${esc(p.id)}</td>
          <td><a class="table__link" href="#">${esc(p.name)}</a></td>
          <td>${esc(p.rank)}</td>
          <td>${esc(p.position)}</td>
          <td>${badge(p.status)}</td>
          <td class="table__col-actions">${icon('dots')}</td>
        </tr>`).join('')
      : `<tr><td class="table__empty" colspan="6">Chưa có dữ liệu quân nhân cho đơn vị này.</td></tr>`;
  }

  /* ---------- Render: detail ---------- */
  const infoGrid = (rows) => `<div class="info-grid">${rows.map(([l, v, mono]) =>
    `<div class="info-grid__row"><span class="info-grid__label">${esc(l)}</span><span class="info-grid__value${mono ? ' mono' : ''}">${esc(v)}</span></div>`).join('')}</div>`;
  const section = (title, body) => `<div class="section"><h3 class="section__title">${esc(title)}</h3>${body}</div>`;
  const dataTable = (heads, rows, cellFmt = (c) => esc(c)) => `
    <table class="table"><thead><tr>${heads.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${rows.length ? rows.map((r) => `<tr>${r.map((c, i) => `<td>${cellFmt(c, i)}</td>`).join('')}</tr>`).join('')
      : `<tr><td class="table__empty" colspan="${heads.length}">Không có dữ liệu.</td></tr>`}</tbody></table>`;

  const tabRenderers = {
    profile: (d) => section('THÔNG TIN CÁ NHÂN', infoGrid(d.personal)) + section('THÔNG TIN QUÂN SỰ', infoGrid(d.military)) + section('LÝ LỊCH CHÍNH TRỊ', infoGrid(d.politics)),
    equipment: (d) => section('QUÂN TƯ TRANG ĐÃ CẤP', dataTable(['Tên trang bị', 'Số lượng', 'Ngày cấp', 'Tình trạng'], d.equipment,
      (c, i) => i === 3 ? `<span class="badge badge--${c === 'Tốt' ? 'ok' : 'warn'}">${esc(c)}</span>` : esc(c))),
    family: (d) => section('QUAN HỆ GIA ĐÌNH', dataTable(['Quan hệ', 'Họ và tên', 'Năm sinh', 'Nghề nghiệp'], d.family)),
    discipline: (d) => section('HÌNH THỨC KỶ LUẬT', dataTable(['Ngày', 'Hình thức', 'Lý do', 'Quyết định'], d.discipline)),
    rewards: (d) => section('KHEN THƯỞNG', dataTable(['Năm', 'Danh hiệu', 'Cấp khen', 'Quyết định'], d.rewards))
  };

  function emptyDetail(p) {
    const dash = (labels) => labels.map((l) => [l, '—']);
    return {
      personal: [['Mã quân nhân', p.id, true], ...dash(['CCCD', 'Ngày sinh', 'Dân tộc', 'Tôn giáo', 'Quê quán', 'Chỗ ở hiện nay'])].slice(0, 7).concat([['Họ và tên', p.name]]),
      military: [['Cấp bậc', p.rank], ['Chức vụ', p.position], ...dash(['Ngày nhập ngũ', 'Đơn vị cũ', 'Trình độ'])],
      politics: dash(['Ngày vào Đoàn', 'Ngày kết nạp Đảng', 'Nơi kết nạp Đảng']),
      equipment: [], family: [], discipline: [], rewards: []
    };
  }

  function renderDetail() {
    const unit = findUnit(state.unitId);
    const p = (personnel[state.unitId] || []).find((x) => x.id === state.personId);
    if (!p) return;
    const d = details[p.id] || emptyDetail(p);

    $('detail-avatar').textContent = initials(p.name);
    $('detail-name').textContent = p.name.toUpperCase();
    $('detail-meta').innerHTML = `<span class="mono">${esc(p.id)}</span> · ${esc(p.rank)} · ${esc(p.position)} · ${esc(unit.name)}`;
    const b = $('detail-status');
    b.className = `badge badge--${statusBadge[p.status] || 'info'}`;
    b.textContent = p.status;

    $('detail-tabs').innerHTML = TABS.map((t) =>
      `<button class="tabs__item${t.key === state.tab ? ' is-active' : ''}" role="tab" data-tab="${t.key}">${t.label}</button>`).join('');
    $('detail-panel').innerHTML = tabRenderers[state.tab](d);
  }

  /* ---------- View switching (workspace đơn) ---------- */
  function showView(view) {
    state.view = view;
    $('view-list').hidden = view !== 'list';
    $('view-detail').hidden = view !== 'detail';
    if (view === 'list') renderList(); else renderDetail();
  }

  /* ---------- Events (delegation) ---------- */
  $('unit-tree').addEventListener('click', (e) => {
    const node = e.target.closest('.unit-node');
    if (!node) return;
    const id = node.dataset.unit;
    if (node.dataset.type === 'company') {
      state.unitId = id;
      state.listQuery = '';
      $('list-search').value = '';
      renderTree();
      showView('list');                // chọn đơn vị khác → về danh sách
    } else {
      state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id);
      renderTree();
    }
  });

  $('personnel-tbody').addEventListener('click', (e) => {
    const row = e.target.closest('[data-person]');
    if (!row) return;
    e.preventDefault();
    state.personId = row.dataset.person;
    state.tab = 'profile';
    showView('detail');                // danh sách biến mất, chi tiết hiện ra
  });

  $('btn-back').addEventListener('click', (e) => { e.preventDefault(); showView('list'); });

  $('detail-tabs').addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab]');
    if (!t) return;
    state.tab = t.dataset.tab;
    renderDetail();                    // chỉ nội dung dưới tab đổi
  });

  $('unit-search').addEventListener('input', (e) => { state.unitQuery = e.target.value; renderTree(); });
  $('list-search').addEventListener('input', (e) => { state.listQuery = e.target.value; renderList(); });

  $('main-nav').addEventListener('click', (e) => {
    const item = e.target.closest('.nav__item');
    if (!item) return;
    document.querySelectorAll('.nav__item').forEach((n) => n.classList.toggle('is-active', n === item));
    $('page-title').textContent = item.querySelector('span').textContent;
  });

  $('sidebar-toggle').addEventListener('click', () => {
    $('sidebar').classList.toggle('is-collapsed');
    $('app').classList.toggle('is-collapsed');
  });

  /* ---------- Init ---------- */
  renderTree();
  showView('list');
})();
