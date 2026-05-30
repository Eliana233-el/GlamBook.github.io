/* ═══════════════════════════════════════
   DADOS — 5 profissionais por salão
═══════════════════════════════════════ */
const SALOES = {
  brilho: {
    nome:'Salão Brilho Feminino', morada:'Av. Eduardo Mondlane, Centro',
    emoji:'💇‍♀️', tags:['Cabelo','Unhas','Tranças','Coloração'],
    servicos:[
      {value:'corte',     label:'Corte de Cabelo',    preco:'350', profis:['ana','luiza','kezia']},
      {value:'trancas',   label:'Tranças / Extensões', preco:'1000', profis:['luiza','kezia']},
      {value:'coloracao', label:'Coloração',           preco:'850', profis:['luiza','dina']},
      {value:'unhas',     label:'Manicure / Pedicure', preco:'250', profis:['carla','dina']},
      {value:'escova',    label:'Escova / Alisamento', preco:'320', profis:['ana','luiza','kezia']},
      {value:'hidrat',    label:'Hidratação Capilar',  preco:'450', profis:['ana','dina']},
    ],
    profis:[
      {value:'ana',   label:'Ana Maria',      esp:'Corte & Hidratação'},
      {value:'luiza', label:'Luiza Mangue',   esp:'Tranças & Coloração'},
      {value:'carla', label:'Carla Jossias',  esp:'Unhas & Estética'},
      {value:'kezia', label:'Kézia Tivane',   esp:'Tranças & Escova'},
      {value:'dina',  label:'Dina Muiambo',   esp:'Coloração & Unhas'},
    ]
  },
  estilo: {
    nome:'Estilo & Charme', morada:'Rua 25 de Setembro, Matundo',
    emoji:'✂️', tags:['Coloração','Extensões','Barba','Corte'],
    servicos:[
      {value:'corte',     label:'Corte de Cabelo',    preco:'320', profis:['mario','gilberto','herminio']},
      {value:'coloracao', label:'Coloração',           preco:'900', profis:['beatriz','alice']},
      {value:'extensoes', label:'Extensões',           preco:'1300', profis:['alice','beatriz']},
      {value:'barba',     label:'Barba',               preco:'200', profis:['mario','gilberto']},
      {value:'trancas',   label:'Tranças',             preco:'900', profis:['alice','herminio']},
      {value:'tratamento',label:'Tratamento Capilar',  preco:'600', profis:['beatriz','alice']},
    ],
    profis:[
      {value:'beatriz',  label:'Beatriz Neves',  esp:'Coloração & Tratamento'},
      {value:'alice',    label:'Alice Tembe',    esp:'Extensões & Tranças'},
      {value:'mario',    label:'Mário Tembe',    esp:'Barba & Corte'},
      {value:'gilberto', label:'Gilberto Saúte', esp:'Corte & Barba'},
      {value:'herminio', label:'Hermínio Malate',esp:'Corte & Tranças'},
    ]
  },
  vip: {
    nome:'Espaço VIP', morada:'Av. da Liberdade, Moatize',
    emoji:'👑', tags:['Tratamentos','Unhas','Premium','Spa'],
    servicos:[
      {value:'tratamento',  label:'Tratamento Capilar',    preco:'650', profis:['helena','leonor']},
      {value:'unhas',       label:'Unhas (Gel / Acrílico)', preco:'500', profis:['grace','sonia']},
      {value:'sobrancelha', label:'Sobrancelha & Design',   preco:'200', profis:['grace','virginia']},
      {value:'barba',       label:'Barba Premium',          preco:'280', profis:['pedro']},
      {value:'massagem',    label:'Massagem Capilar',       preco:'450', profis:['helena','virginia']},
      {value:'coloracao',   label:'Coloração Premium',      preco:'1200', profis:['leonor','helena']},
    ],
    profis:[
      {value:'pedro',    label:'Pedro Santos',     esp:'Barba Premium'},
      {value:'grace',    label:'Grace Muianga',    esp:'Unhas & Sobrancelha'},
      {value:'helena',   label:'Helena Zandamela', esp:'Tratamentos Capilares'},
      {value:'sonia',    label:'Sónia Bila',       esp:'Unhas & Estética'},
      {value:'leonor',   label:'Leonor Macuácua',  esp:'Coloração & Tratamento'},
    ]
  }
};

const STORAGE_SALOES_KEY = 'glambook_saloes';

function normalizeSlug(text) {
  return String(text || '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function loadSavedSaloes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_SALOES_KEY) || 'null');
    if (!stored) return;
    Object.entries(stored).forEach(([key, data]) => {
      if (!SALOES[key]) return;
      if (Array.isArray(data.servicos)) SALOES[key].servicos = data.servicos;
      if (Array.isArray(data.profis)) SALOES[key].profis = data.profis;
    });
  } catch (err) {
    console.warn('Não foi possível ler dados de administração:', err);
  }
}

function saveSalonChanges() {
  const payload = {
    brilho: { servicos: SALOES.brilho.servicos, profis: SALOES.brilho.profis },
    estilo: { servicos: SALOES.estilo.servicos, profis: SALOES.estilo.profis },
    vip: { servicos: SALOES.vip.servicos, profis: SALOES.vip.profis }
  };
  localStorage.setItem(STORAGE_SALOES_KEY, JSON.stringify(payload));
}

loadSavedSaloes();

const ADMIN_PASSWORDS_KEY = 'glambook_admin_passwords';
const ADMIN_SESSION_KEY = 'glambook_admin_session';

function initializeAdminPasswords() {
  try {
    const stored = JSON.parse(localStorage.getItem(ADMIN_PASSWORDS_KEY) || 'null');
    if (stored && stored.brilho && stored.estilo && stored.vip) return;
  } catch (err) {}
  const passwords = {
    brilho: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
    estilo: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
    vip: String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  };
  localStorage.setItem(ADMIN_PASSWORDS_KEY, JSON.stringify(passwords));
  console.log('🔐 Senhas de administrador inicializadas. (Para demonstração, veja o console)');
  console.log('Senhas:', passwords);
}

initializeAdminPasswords();

let currentAdminSession = null;

function authenticateAdmin() {
  const salao = document.getElementById('auth-salao').value;
  const password = document.getElementById('auth-password').value;
  const error = document.getElementById('auth-error');
  if (!salao || !password) {
    error.textContent = 'Selecione um salão e insira a senha';
    error.style.display = 'flex';
    return;
  }
  try {
    const passwords = JSON.parse(localStorage.getItem(ADMIN_PASSWORDS_KEY) || '{}');
    if (passwords[salao] === password) {
      currentAdminSession = salao;
      localStorage.setItem(ADMIN_SESSION_KEY, salao);
      document.getElementById('admin-auth-modal').style.display = 'none';
      document.getElementById('admin-content').classList.remove('hide');
      renderAdminSalon();
      error.style.display = 'none';
    } else {
      error.textContent = 'Senha incorreta';
      error.style.display = 'flex';
      document.getElementById('auth-password').value = '';
    }
  } catch (err) {
    error.textContent = 'Erro na autenticação';
    error.style.display = 'flex';
  }
}

function closeAdminAuth() {
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-salao').value = '';
  document.getElementById('auth-error').style.display = 'none';
  document.getElementById('auth-password-display').style.display = 'none';
  showPage('booking');
}

function revealAdminPassword() {
  const salao = document.getElementById('auth-salao').value;
  const display = document.getElementById('auth-password-display');
  if (!salao) {
    display.textContent = 'Selecione um salão primeiro.';
    display.style.display = 'block';
    return;
  }
  const passwords = JSON.parse(localStorage.getItem(ADMIN_PASSWORDS_KEY) || '{}');
  const secret = passwords[salao];
  if (!secret) {
    display.textContent = 'Senha não encontrada para este salão.';
    display.style.display = 'block';
    return;
  }
  display.innerHTML = `Senha de admin para <strong>${document.getElementById('auth-salao').selectedOptions[0].text}</strong>: <strong>${secret}</strong>`;
  display.style.display = 'block';
}

function logoutAdmin() {
  currentAdminSession = null;
  localStorage.removeItem(ADMIN_SESSION_KEY);
  document.getElementById('admin-auth-modal').style.display = 'flex';
  document.getElementById('admin-content').classList.add('hide');
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-salao').value = '';
  document.getElementById('auth-password-display').style.display = 'none';
  showPage('admin');
}

function getAdminSalonKey() {
  if (!currentAdminSession) return '';
  return currentAdminSession;
}

const HORAS_BASE  = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30'];
const UNAVAILABLE = ['09:30','11:00','15:00'];
let currentStep  = 1;
let horaSelected = '';

/* ═══ PAGES ═══ */
function showPage(id) {
  if (id === 'admin') {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-admin').classList.add('active');
    if (!currentAdminSession) {
      document.getElementById('admin-auth-modal').style.display = 'flex';
      document.getElementById('admin-content').classList.add('hide');
    } else {
      document.getElementById('admin-auth-modal').style.display = 'none';
      document.getElementById('admin-content').classList.remove('hide');
      renderAdminSalon();
    }
    window.scrollTo(0, 0);
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (id === 'history') renderHistory();
  window.scrollTo(0, 0);
}

/* ═══ STEPS ═══ */
function goStep(n) {
  if (n > currentStep && !validateStep(currentStep)) return;
  document.getElementById('step' + currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('step' + currentStep).classList.add('active');
  if (n === 4) buildResumo();
  updateProgress(n);
  document.querySelector('.booking-card').scrollIntoView({behavior:'smooth', block:'start'});
}

function updateProgress(n) {
  for (let i = 1; i <= 4; i++) {
    const sc = document.getElementById('sc' + i);
    const sl = document.getElementById('sl-' + i);
    sc.classList.remove('active','done');
    sl.classList.remove('active','done');
    if      (i <  n){ sc.classList.add('done');   sc.textContent = '✓'; sl.classList.add('done'); }
    else if (i === n){ sc.classList.add('active'); sc.textContent = i;   sl.classList.add('active'); }
    else             { sc.textContent = i; }
    const line = document.getElementById('sl' + i);
    if (line) line.classList.toggle('done', i < n);
  }
}

/* ═══ VALIDATION ═══ */
function showErr(id, show) { const e = document.getElementById(id); if (e) e.classList.toggle('show', show); }
function markErr(id, has)  { const e = document.getElementById(id); if (e) e.classList.toggle('error', has); }

function validateStep(s) {
  let ok = true;
  if (s === 1) {
    const sal = document.getElementById('salao').value;
    const srv = document.getElementById('servico').value;
    showErr('err-salao', !sal);   markErr('salao', !sal);
    showErr('err-servico', !srv); markErr('servico', !srv);
    if (!sal || !srv) ok = false;
  }
  if (s === 2) {
    const ate  = document.getElementById('atendente').value;
    const nome = document.getElementById('nome-cliente').value.trim();
    showErr('err-atendente', !ate); markErr('atendente', !ate);
    showErr('err-nome', !nome);      markErr('nome-cliente', !nome);
    if (!ate || !nome) ok = false;
  }
  if (s === 3) {
    const dt    = document.getElementById('data-hora').value;
    const valid = dt && new Date(dt) > new Date();
    const hora  = horaSelected || (dt ? dt.split('T')[1]?.slice(0,5) : '');
    showErr('err-data', !valid); markErr('data-hora', !valid);
    showErr('err-hora', !hora);
    if (!valid || !hora) ok = false;
  }
  return ok;
}

/* ═══ SALÃO ═══ */
document.getElementById('salao').addEventListener('change', function() {
  const v = this.value;
  markErr('salao', false); showErr('err-salao', false);
  const ateSel  = document.getElementById('atendente');
  const servSel = document.getElementById('servico');
  const hint    = document.getElementById('atendente-hint');
  const gallery = document.getElementById('salao-gallery');
  ateSel.innerHTML = '<option value="">Selecione um serviço primeiro...</option>';
  ateSel.disabled = true;
  servSel.innerHTML = '<option value="">Selecione o serviço...</option>';
  servSel.disabled = !v;
  horaSelected = '';
  document.getElementById('preco-box').classList.remove('show');
  if (!v) {
    servSel.disabled = true;
    servSel.innerHTML = '<option value="">Primeiro, selecione um salão...</option>';
    hint.textContent = 'Selecione um serviço para ver os profissionais disponíveis.';
    gallery.classList.remove('visible');
    return;
  }
  const d = SALOES[v];
  document.getElementById('gallery-emoji').textContent  = d.emoji;
  document.getElementById('gallery-nome').textContent   = d.nome;
  document.getElementById('gallery-morada').textContent = d.morada;
  document.getElementById('gallery-tags').innerHTML     = d.tags.map(t => `<span class="gallery-tag">${t}</span>`).join('');
  gallery.classList.add('visible');
  d.servicos.forEach(s => {
    const o = document.createElement('option');
    o.value = s.value; o.textContent = s.label;
    servSel.appendChild(o);
  });
});

/* ═══ PROFISSIONAL → limpeza de erro apenas ═══ */
document.getElementById('atendente').addEventListener('change', function() {
  markErr('atendente', false); showErr('err-atendente', false);
});

/* ═══ SERVIÇO → preço e profissionais ═══ */
document.getElementById('servico').addEventListener('change', function() {
  markErr('servico', false); showErr('err-servico', false);
  const sal = document.getElementById('salao').value, v = this.value;
  const box = document.getElementById('preco-box');
  const ateSel = document.getElementById('atendente');
  ateSel.innerHTML = '<option value="">Selecione um profissional...</option>';
  ateSel.disabled = true;
  if (!sal || !v) { box.classList.remove('show'); return; }
  const s = SALOES[sal].servicos.find(x => x.value === v);
  if (s) {
    document.getElementById('preco-valor').innerHTML = `${s.preco} <span>MT</span>`;
    box.classList.add('show');
    const proList = SALOES[sal].profis.filter(p => s.profis.includes(p.value));
    if (proList.length) {
      proList.forEach(p => {
        const o = document.createElement('option');
        o.value = p.value; o.textContent = p.label;
        ateSel.appendChild(o);
      });
      ateSel.disabled = false;
      const hint = document.getElementById('atendente-hint');
      hint.textContent = `${proList.length} profissionais disponíveis para este serviço.`;
      hint.style.color = 'var(--gold)';
      setTimeout(() => hint.style.color = '', 2500);
    }
  }
});

/* ═══ DATA → horários ═══ */
document.getElementById('data-hora').addEventListener('change', function() {
  markErr('data-hora', false); showErr('err-data', false);
  horaSelected = '';
  const grid = document.getElementById('horarios-grid'), val = this.value;
  if (!val) { grid.innerHTML = ''; return; }
  if (new Date(val) <= new Date()) { showErr('err-data', true); markErr('data-hora', true); grid.innerHTML = ''; return; }
  grid.innerHTML = HORAS_BASE.map(h => {
    const u = UNAVAILABLE.includes(h);
    return `<button type="button" class="hora-btn" onclick="${u ? '' : `selectHora(this,'${h}')`}" ${u ? 'disabled' : ''}>${h}</button>`;
  }).join('');
  showErr('err-hora', false);
});

function selectHora(btn, h) {
  document.querySelectorAll('.hora-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); horaSelected = h;
  const dt = document.getElementById('data-hora').value;
  if (dt) document.getElementById('data-hora').value = dt.split('T')[0] + 'T' + h;
  showErr('err-hora', false);
}

window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('data-hora');
  const now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  el.min = now.toISOString().slice(0, 16);
  initAdminPage();
  initMobileNav();
});

function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('nav-open'));
  document.querySelectorAll('nav ul li a').forEach(link => link.addEventListener('click', () => nav.classList.remove('nav-open')));
}

/* ═══ RESUMO ═══ */
function buildResumo() {
  const salaoV = document.getElementById('salao').value;
  const ateV   = document.getElementById('atendente').value;
  const servV  = document.getElementById('servico').value;
  const nome   = document.getElementById('nome-cliente').value;
  const dt     = document.getElementById('data-hora').value;
  const hora   = horaSelected || (dt ? dt.split('T')[1]?.slice(0,5) : '');
  const data   = dt ? new Date(dt).toLocaleDateString('pt-BR', {dateStyle:'long'}) : '—';
  const sd     = SALOES[salaoV] || {};
  const ateLabel = sd.profis?.find(p => p.value === ateV)?.label || ateV;
  const servData = sd.servicos?.find(s => s.value === servV);
  document.getElementById('resumo-card').innerHTML = `
    <div class="resumo-titulo">Resumo da Marcação</div>
    <div class="resumo-row"><span>👤 Cliente</span><strong>${nome}</strong></div>
    <div class="resumo-row"><span>📍 Salão</span><strong>${sd.nome || salaoV}</strong></div>
    <div class="resumo-row"><span>💆 Profissional</span><strong>${ateLabel}</strong></div>
    <div class="resumo-row"><span>✂️ Serviço</span><strong>${servData?.label || servV}</strong></div>
    <div class="resumo-row"><span>📅 Data</span><strong>${data}</strong></div>
    <div class="resumo-row"><span>🕐 Hora</span><strong>${hora}</strong></div>
    <div class="resumo-total"><span>Preço</span><strong>${servData?.preco || '—'} MT</strong></div>`;
}

/* ═══ SUBMIT ═══ */
document.getElementById('agendamento-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const salaoV   = document.getElementById('salao').value;
  const ateV     = document.getElementById('atendente').value;
  const servV    = document.getElementById('servico').value;
  const nome     = document.getElementById('nome-cliente').value;
  const dt       = document.getElementById('data-hora').value;
  const hora     = horaSelected || (dt ? dt.split('T')[1]?.slice(0,5) : '');
  const dataFmt  = dt ? new Date(dt).toLocaleDateString('pt-BR', {dateStyle:'long'}) : '—';
  const sd       = SALOES[salaoV] || {};
  const ateLabel = sd.profis?.find(p => p.value === ateV)?.label || ateV;
  const servData = sd.servicos?.find(s => s.value === servV);
  document.getElementById('confirm-details').innerHTML = `
    <div class="confirm-row"><span>👤 Cliente</span><strong>${nome}</strong></div>
    <div class="confirm-row"><span>📍 Salão</span><strong>${sd.nome || salaoV}</strong></div>
    <div class="confirm-row"><span>💆 Profissional</span><strong>${ateLabel}</strong></div>
    <div class="confirm-row"><span>✂️ Serviço</span><strong>${servData?.label || servV}</strong></div>
    <div class="confirm-row"><span>📅 Data</span><strong>${dataFmt}</strong></div>
    <div class="confirm-row"><span>🕐 Hora</span><strong>${hora}</strong></div>
    <div class="confirm-row"><span>💰 Preço</span><strong>${servData?.preco || '—'} MT</strong></div>`;
  const hist = JSON.parse(localStorage.getItem('glambook_history') || '[]');
  hist.unshift({id:Date.now(), nome, salao:sd.nome||salaoV, atendente:ateLabel, servico:servData?.label||servV, data:dataFmt, hora, preco:servData?.preco||'—', timestamp:new Date().toISOString()});
  localStorage.setItem('glambook_history', JSON.stringify(hist));
  showPage('confirm');
});

function novaMarcacao() {
  document.getElementById('agendamento-form').reset();
  const ate = document.getElementById('atendente');
  ate.disabled = true; ate.innerHTML = '<option value="">Primeiro, selecione um salão...</option>';
  document.getElementById('servico').innerHTML = '<option value="">Selecione o serviço...</option>';
  document.getElementById('atendente-hint').textContent = 'Selecione um salão para ver os profissionais.';
  document.getElementById('salao-gallery').classList.remove('visible');
  document.getElementById('preco-box').classList.remove('show');
  document.getElementById('horarios-grid').innerHTML = '';
  horaSelected = ''; currentStep = 1;
  document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
  updateProgress(1); showPage('booking');
}

function initAdminPage() {
  const authModal = document.getElementById('admin-auth-modal');
  const adminContent = document.getElementById('admin-content');
  if (!authModal || !adminContent) return;
  document.getElementById('admin-servico-form').addEventListener('submit', saveAdminService);
  document.getElementById('admin-prof-form').addEventListener('submit', saveAdminProf);
  const authPassword = document.getElementById('auth-password');
  if (authPassword) {
    authPassword.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') authenticateAdmin();
    });
  }
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (session && SALOES[session]) {
    currentAdminSession = session;
    authModal.style.display = 'none';
    adminContent.classList.remove('hide');
    renderAdminSalon();
  } else {
    authModal.style.display = 'flex';
    adminContent.classList.add('hide');
  }
}

function renderAdminSalon() {
  const key = getAdminSalonKey();
  const welcome = document.getElementById('admin-welcome');
  const tools = document.getElementById('admin-tools');
  if (!key) {
    welcome.textContent = 'Selecione um salão para começar a editar.';
    tools.classList.add('hide');
    return;
  }
  const salon = SALOES[key];
  welcome.textContent = `Administrando ${salon.nome}. Você só pode alterar este salão.`;
  tools.classList.remove('hide');
  populateServiceMultiSelect(salon);
  renderAdminServiceList(salon);
  renderAdminProfList(salon);
  resetAdminServiceForm();
  resetAdminProfForm();
}

function populateServiceMultiSelect(salon) {
  const select = document.getElementById('admin-prof-servicos');
  select.innerHTML = '';
  salon.servicos.forEach(s => {
    const o = document.createElement('option');
    o.value = s.value;
    o.textContent = `${s.label} (${s.preco} MT)`;
    select.appendChild(o);
  });
}

function renderAdminServiceList(salon) {
  const list = document.getElementById('admin-servicos-list');
  if (!salon.servicos.length) {
    list.innerHTML = '<div class="field-hint">Sem serviços cadastrados para este salão.</div>';
    return;
  }
  list.innerHTML = salon.servicos.map(s => `
    <div class="admin-list-item">
      <div>
        <strong>${s.label}</strong>
        <div style="font-size:.82rem;color:var(--text-dim);margin-top:4px;">Preço: ${s.preco} MT</div>
        <div style="font-size:.78rem;color:var(--text-muted);margin-top:4px;">Profissionais: ${s.profis.length}</div>
      </div>
      <div class="admin-action">
        <button type="button" class="btn-prev" onclick="editAdminService('${s.value}')">Editar</button>
        <button type="button" class="btn-prev" onclick="deleteAdminService('${s.value}')">Remover</button>
      </div>
    </div>
  `).join('');
}

function renderAdminProfList(salon) {
  const list = document.getElementById('admin-profs-list');
  if (!salon.profis.length) {
    list.innerHTML = '<div class="field-hint">Sem funcionários cadastrados para este salão.</div>';
    return;
  }
  list.innerHTML = salon.profis.map(p => {
    const services = salon.servicos.filter(s => s.profis.includes(p.value)).map(s => s.label).join(', ') || 'Nenhum';
    return `
      <div class="admin-list-item">
        <div>
          <strong>${p.label}</strong>
          <div style="font-size:.82rem;color:var(--text-dim);margin-top:4px;">${p.esp}</div>
          <div style="font-size:.78rem;color:var(--text-muted);margin-top:4px;">Serviços: ${services}</div>
        </div>
        <div class="admin-action">
          <button type="button" class="btn-prev" onclick="editAdminProf('${p.value}')">Editar</button>
          <button type="button" class="btn-prev" onclick="deleteAdminProf('${p.value}')">Remover</button>
        </div>
      </div>
    `;
  }).join('');
}

function resetAdminServiceForm() {
  document.getElementById('admin-service-label').value = '';
  document.getElementById('admin-service-price').value = '';
  document.getElementById('admin-service-value').value = '';
  document.getElementById('admin-service-edit').value = '';
}

function resetAdminProfForm() {
  document.getElementById('admin-prof-label').value = '';
  document.getElementById('admin-prof-esp').value = '';
  document.getElementById('admin-prof-edit').value = '';
  Array.from(document.getElementById('admin-prof-servicos').options).forEach(o => o.selected = false);
}

function saveAdminService(event) {
  event.preventDefault();
  const key = getAdminSalonKey();
  if (!key) return;
  const salon = SALOES[key];
  const label = document.getElementById('admin-service-label').value.trim();
  const price = document.getElementById('admin-service-price').value.trim();
  let value = document.getElementById('admin-service-value').value.trim() || normalizeSlug(label);
  const editKey = document.getElementById('admin-service-edit').value;
  if (!label || !price) return alert('Preencha o nome e o preço do serviço.');
  if (!value) return alert('Informe um ID interno válido ou um nome para o serviço.');
  if (editKey) {
    const service = salon.servicos.find(s => s.value === editKey);
    if (!service) return;
    if (value !== editKey && salon.servicos.some(s => s.value === value)) return alert('Já existe um serviço com esse ID interno.');
    service.value = value;
    service.label = label;
    service.preco = price;
  } else {
    if (salon.servicos.some(s => s.value === value)) return alert('Já existe um serviço com esse ID interno.');
    salon.servicos.push({ value, label, preco: price, profis: [] });
  }
  saveSalonChanges();
  renderAdminSalon();
}

function saveAdminProf(event) {
  event.preventDefault();
  const key = getAdminSalonKey();
  if (!key) return;
  const salon = SALOES[key];
  const label = document.getElementById('admin-prof-label').value.trim();
  const esp = document.getElementById('admin-prof-esp').value.trim();
  const selected = Array.from(document.getElementById('admin-prof-servicos').selectedOptions).map(o => o.value);
  let value = normalizeSlug(label);
  const editKey = document.getElementById('admin-prof-edit').value;
  if (!label || !esp || !selected.length) return alert('Preencha nome, especialidade e selecione pelo menos um serviço.');
  if (editKey) {
    const prof = salon.profis.find(p => p.value === editKey);
    if (!prof) return;
    if (value !== editKey && salon.profis.some(p => p.value === value)) return alert('Já existe um funcionário com esse nome interno.');
    prof.value = value;
    prof.label = label;
    prof.esp = esp;
    salon.servicos.forEach(s => {
      const idx = s.profis.indexOf(editKey);
      if (idx !== -1) s.profis[idx] = value;
    });
  } else {
    if (salon.profis.some(p => p.value === value)) return alert('Já existe um funcionário com esse nome interno.');
    salon.profis.push({ value, label, esp });
  }
  salon.servicos.forEach(s => {
    const assigned = selected.includes(s.value);
    const id = editKey || value;
    const index = s.profis.indexOf(id);
    if (assigned && index === -1) s.profis.push(id);
    if (!assigned && index !== -1) s.profis.splice(index, 1);
  });
  saveSalonChanges();
  renderAdminSalon();
}

function editAdminService(value) {
  const key = getAdminSalonKey();
  if (!key) return;
  const salon = SALOES[key];
  const service = salon.servicos.find(s => s.value === value);
  if (!service) return;
  document.getElementById('admin-service-label').value = service.label;
  document.getElementById('admin-service-price').value = service.preco;
  document.getElementById('admin-service-value').value = service.value;
  document.getElementById('admin-service-edit').value = service.value;
}

function deleteAdminService(value) {
  const key = getAdminSalonKey();
  if (!key) return;
  if (!confirm('Remover este serviço? Essa ação não pode ser desfeita.')) return;
  const salon = SALOES[key];
  salon.servicos = salon.servicos.filter(s => s.value !== value);
  saveSalonChanges();
  renderAdminSalon();
}

function editAdminProf(value) {
  const key = getAdminSalonKey();
  if (!key) return;
  const salon = SALOES[key];
  const prof = salon.profis.find(p => p.value === value);
  if (!prof) return;
  document.getElementById('admin-prof-label').value = prof.label;
  document.getElementById('admin-prof-esp').value = prof.esp;
  document.getElementById('admin-prof-edit').value = prof.value;
  Array.from(document.getElementById('admin-prof-servicos').options).forEach(o => {
    o.selected = salon.servicos.find(s => s.value === o.value)?.profis.includes(prof.value) || false;
  });
}

function deleteAdminProf(value) {
  const key = getAdminSalonKey();
  if (!key) return;
  if (!confirm('Remover este funcionário? Essa ação não pode ser desfeita.')) return;
  const salon = SALOES[key];
  salon.profis = salon.profis.filter(p => p.value !== value);
  salon.servicos.forEach(s => {
    const idx = s.profis.indexOf(value);
    if (idx !== -1) s.profis.splice(idx, 1);
  });
  saveSalonChanges();
  renderAdminSalon();
}

/* ═══ HISTORY ═══ */
function renderHistory() {
  const hist = JSON.parse(localStorage.getItem('glambook_history') || '[]');
  const el = document.getElementById('history-content');
  if (!hist.length) {
    el.innerHTML = `<div class="history-empty"><div class="empty-icon">📋</div><p>Ainda não tem marcações registadas.</p></div>`;
    return;
  }
  el.innerHTML = `<div class="history-list">${hist.map((h,i) => `
    <div class="history-item" style="animation-delay:${i*.06}s">
      <div><div class="h-date">${h.data} — ${h.hora}</div><div class="h-name">${h.salao}</div><div class="h-detail">${h.atendente} · ${h.servico} · ${h.nome}</div></div>
      <div class="h-right"><div class="h-price">${h.preco} MT</div><span class="h-badge">Confirmado</span></div>
    </div>`).join('')}</div>
    <button class="history-clear" onclick="clearHistory()">Limpar Histórico</button>`;
}
function clearHistory() {
  if (confirm('Apagar todo o histórico?')) { localStorage.removeItem('glambook_history'); renderHistory(); }
}

/* ═══ SUPPORT ═══ */
let selectedTipo  = 'tipo-reclamacao';
let selectedRating = 0;

function selectTipo(btn) {
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedTipo = btn.id;
}

function setRating(n) {
  selectedRating = n;
  document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < n));
}

function updateCharCount(el) {
  document.getElementById('char-count').textContent = `${el.value.length} / 500`;
}

function submitComplaint() {
  const nome     = document.getElementById('c-nome').value.trim();
  const contacto = document.getElementById('c-contacto').value.trim();
  const msg      = document.getElementById('c-mensagem').value.trim();
  let ok = true;
  showErr('err-c-nome',     !nome);     markErr('c-nome',      !nome);
  showErr('err-c-contacto', !contacto); markErr('c-contacto',  !contacto);
  showErr('err-c-mensagem', !msg);      markErr('c-mensagem',   !msg);
  if (!nome || !contacto || !msg) return;
  document.getElementById('form-success').classList.add('show');
  document.getElementById('c-nome').value = '';
  document.getElementById('c-contacto').value = '';
  document.getElementById('c-mensagem').value = '';
  document.getElementById('c-salao').value = '';
  document.getElementById('char-count').textContent = '0 / 500';
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('tipo-reclamacao').classList.add('selected');
  document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
  selectedRating = 0;
  setTimeout(() => document.getElementById('form-success').classList.remove('show'), 5000);
}
