// ============================================================
// AGENDAMENTOS.JS — ReabilitaCare
// Fluxo: Data → Médico/Filtro → Horário → Modal → Confirmação
// ============================================================

// ─── Estado global ───────────────────────────────────────────
const estado = {
  dataSelecionada: null,   // { dia, mes, ano, label }
  medicoSelecionado: null, // { id, nome, especialidade }
  horarioSelecionado: null // string "HH:MM"
};

// ─── Calendário ──────────────────────────────────────────────
const daysTag      = document.querySelector('.days');
const currentDate  = document.querySelector('.current-date');
const prevNextIcon = document.querySelectorAll('.icons span');

const hoje = new Date();
let currYear  = hoje.getFullYear();
let currMonth = hoje.getMonth();

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const diasSemana = ['domingo','segunda-feira','terça-feira','quarta-feira',
                    'quinta-feira','sexta-feira','sábado'];

function renderCalendar() {
  const primeiroDia     = new Date(currYear, currMonth, 1).getDay();
  const ultimoDia       = new Date(currYear, currMonth + 1, 0).getDate();
  const ultimoDiaSemana = new Date(currYear, currMonth, ultimoDia).getDay();
  const ultimoDiaMesAnt = new Date(currYear, currMonth, 0).getDate();

  let li = '';

  // Dias do mês anterior (preenchimento)
  for (let i = primeiroDia; i > 0; i--) {
    li += `<li class="inactive">${ultimoDiaMesAnt - i + 1}</li>`;
  }

  // Dias do mês atual
  for (let i = 1; i <= ultimoDia; i++) {
    const ehHoje    = i === hoje.getDate() && currMonth === hoje.getMonth() && currYear === hoje.getFullYear();
    const dataItem  = new Date(currYear, currMonth, i);
    const passado   = dataItem < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const selecionado = estado.dataSelecionada &&
                        estado.dataSelecionada.dia === i &&
                        estado.dataSelecionada.mes === currMonth &&
                        estado.dataSelecionada.ano === currYear;

    const classes = [
      ehHoje     ? 'active'     : '',
      passado    ? 'passado'    : '',
      selecionado? 'selected'   : ''
    ].filter(Boolean).join(' ');

    li += `<li class="${classes}" data-dia="${i}">${i}</li>`;
  }

  // Dias do próximo mês (preenchimento)
  for (let i = ultimoDiaSemana; i < 6; i++) {
    li += `<li class="inactive">${i - ultimoDiaSemana + 1}</li>`;
  }

  currentDate.innerText = `${meses[currMonth]} ${currYear}`;
  daysTag.innerHTML = li;

  // Eventos de clique nos dias
  daysTag.querySelectorAll('li:not(.inactive):not(.passado)').forEach(li => {
    li.addEventListener('click', () => selecionarData(parseInt(li.dataset.dia)));
  });
}

function selecionarData(dia) {
  const dataObj = new Date(currYear, currMonth, dia);
  const labelData = `${diasSemana[dataObj.getDay()]}, ${dia} de ${meses[currMonth]} de ${currYear}`;

  estado.dataSelecionada = { dia, mes: currMonth, ano: currYear, label: labelData };

  // Reset seleções posteriores se mudou a data
  estado.medicoSelecionado  = null;
  estado.horarioSelecionado = null;
  limparSelecaoMedicos();

  renderCalendar();
  atualizarBadgeData();
  atualizarStepper();

  // Scroll suave para os médicos
  document.querySelector('aside').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

prevNextIcon.forEach(icon => {
  icon.addEventListener('click', () => {
    currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1;
    if (currMonth < 0 || currMonth > 11) {
      const d = new Date(currYear, currMonth, 1);
      currYear  = d.getFullYear();
      currMonth = d.getMonth();
    }
    renderCalendar();
  });
});

renderCalendar();

// ─── Badge de data ───────────────────────────────────────────
function atualizarBadgeData() {
  const badge = document.getElementById('data-badge');
  const texto = document.getElementById('data-badge-texto');
  if (estado.dataSelecionada) {
    texto.textContent = estado.dataSelecionada.label;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

// ─── Stepper ────────────────────────────────────────────────
function atualizarStepper() {
  const passos = [
    !!estado.dataSelecionada,
    !!estado.medicoSelecionado,
    !!estado.horarioSelecionado,
    false
  ];

  for (let i = 1; i <= 4; i++) {
    const el   = document.getElementById(`step-${i}`);
    const line = document.getElementById(`line-${i}`);
    el.classList.remove('active', 'done');

    if (passos[i - 1]) {
      el.classList.add('done');
      if (line) line.classList.add('done');
    } else if (!passos.slice(0, i - 1).includes(false)) {
      el.classList.add('active');
    }
  }
}

// ─── Filtro de especialidades ────────────────────────────────
const checkboxes = document.querySelectorAll('#filtro-especialidades input[type="checkbox"]');

checkboxes.forEach(cb => cb.addEventListener('change', aplicarFiltro));

function aplicarFiltro() {
  const ativos = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
  const cards  = document.querySelectorAll('.medico[data-especialidades]');
  let visiveis = 0;

  cards.forEach(card => {
    const specs = card.dataset.especialidades.split(' ');
    const visivel = ativos.length === 0 || ativos.some(a => specs.includes(a));
    card.classList.toggle('oculto', !visivel);
    if (visivel) visiveis++;
  });

  document.getElementById('sem-medicos').style.display = visiveis === 0 ? 'block' : 'none';
}

// ─── Médicos — seleção por card ───────────────────────────────
const medicos = {
  'card-ricardo': { id: 'ricardo', nome: 'Dr. Ricardo Mendes',  especialidade: 'Fisioterapia Ortopédica' },
  'card-camila':  { id: 'camila',  nome: 'Dra. Camila Santos',  especialidade: 'Osteopatia & Bem-estar'  }
};

document.querySelectorAll('.medico[id]').forEach(card => {
  card.addEventListener('click', e => {
    // Não propaga se clicou num horário
    if (e.target.closest('.horarios')) return;
    if (!estado.dataSelecionada) {
      mostrarToast('⚠️ Selecione uma data primeiro!', '#7c3aed');
      pulsarCalendario();
      return;
    }
    selecionarMedico(card.id);
  });
});

function selecionarMedico(cardId) {
  // Limpa seleção anterior de horário se mudou de médico
  if (estado.medicoSelecionado && estado.medicoSelecionado.id !== medicos[cardId].id) {
    estado.horarioSelecionado = null;
    limparHorarios();
  }

  document.querySelectorAll('.medico').forEach(c => c.classList.remove('selecionado'));
  document.getElementById(cardId).classList.add('selecionado');
  estado.medicoSelecionado = medicos[cardId];
  atualizarStepper();
}

function limparSelecaoMedicos() {
  document.querySelectorAll('.medico').forEach(c => c.classList.remove('selecionado'));
  limparHorarios();
}

// ─── Horários ────────────────────────────────────────────────
document.querySelectorAll('.horarios p').forEach(p => {
  p.addEventListener('click', e => {
    e.stopPropagation();

    if (!estado.dataSelecionada) {
      mostrarToast('⚠️ Selecione uma data primeiro!', '#7c3aed');
      pulsarCalendario();
      return;
    }

    // Seleciona o médico dono deste horário automaticamente
    const cardPai = p.closest('.medico');
    selecionarMedico(cardPai.id);

    // Desmarca todos e marca este
    limparHorarios();
    p.classList.add('selecionado');
    estado.horarioSelecionado = p.dataset.hora;

    atualizarStepper();

    // Abre o modal após pequeno delay
    setTimeout(() => abrirModal(), 300);
  });
});

function limparHorarios() {
  document.querySelectorAll('.horarios p').forEach(p => p.classList.remove('selecionado'));
}

// ─── Modal ───────────────────────────────────────────────────
const overlay     = document.getElementById('modal-overlay');
const btnFechar   = document.getElementById('modal-fechar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnFinalizar= document.getElementById('btn-finalizar');

function abrirModal() {
  // Preenche resumo
  document.getElementById('resumo-medico').textContent = estado.medicoSelecionado?.nome || '—';
  document.getElementById('resumo-data').textContent   = estado.dataSelecionada?.label  || '—';
  document.getElementById('resumo-hora').textContent   = estado.horarioSelecionado       || '—';

  // Preenche paciente com usuário logado
  const usuario = localStorage.getItem('usuario');
  const campoP  = document.getElementById('modal-paciente');
  if (usuario && !campoP.value) campoP.value = usuario;

  // Limpa erros anteriores
  ['modal-tipo','modal-paciente'].forEach(id => {
    document.getElementById(id).classList.remove('erro');
  });
  document.querySelectorAll('.erro-msg').forEach(e => e.remove());

  overlay.classList.add('aberto');
  document.body.style.overflow = 'hidden';

  // Marca passo 4 como ativo
  document.getElementById('step-4').classList.add('active');
}

function fecharModal() {
  overlay.classList.remove('aberto');
  document.body.style.overflow = '';
  document.getElementById('step-4').classList.remove('active');
}

btnFechar.addEventListener('click', fecharModal);
btnCancelar.addEventListener('click', fecharModal);
overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(); });

// Fecha com ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

// ─── Validação e Finalização ─────────────────────────────────
btnFinalizar.addEventListener('click', () => {
  let valido = true;

  const tipo    = document.getElementById('modal-tipo');
  const paciente= document.getElementById('modal-paciente');

  // Limpa erros
  [tipo, paciente].forEach(el => {
    el.classList.remove('erro');
    const msg = el.parentElement.querySelector('.erro-msg');
    if (msg) msg.remove();
  });

  if (!tipo.value) {
    tipo.classList.add('erro');
    const msg = document.createElement('p');
    msg.className = 'erro-msg';
    msg.textContent = 'Selecione o tipo de consulta';
    tipo.after(msg);
    valido = false;
  }

  if (!paciente.value.trim()) {
    paciente.classList.add('erro');
    const msg = document.createElement('p');
    msg.className = 'erro-msg';
    msg.textContent = 'Informe o nome do paciente';
    paciente.after(msg);
    valido = false;
  }

  if (!valido) return;

  // Salva no localStorage
  const agendamento = {
    medico:       estado.medicoSelecionado?.nome,
    especialidade:estado.medicoSelecionado?.especialidade,
    data:         estado.dataSelecionada?.label,
    hora:         estado.horarioSelecionado,
    tipo:         tipo.options[tipo.selectedIndex].text,
    paciente:     paciente.value.trim(),
    obs:          document.getElementById('modal-obs').value.trim(),
    criadoEm:     new Date().toISOString()
  };

  // Salva agendamento
  const lista = JSON.parse(localStorage.getItem('agendamentos') || '[]');
  lista.push(agendamento);
  localStorage.setItem('agendamentos', JSON.stringify(lista));
  localStorage.setItem('ultimo_agendamento', JSON.stringify(agendamento));

  fecharModal();
  mostrarToast(`Consulta com ${agendamento.medico} agendada!`);

  // Redireciona para pagamentos após 1.8s
  setTimeout(() => {
    window.location.href = 'pagamentos.html';
  }, 1800);
});

// ─── Toast ───────────────────────────────────────────────────
function mostrarToast(msg, cor) {
  const toast = document.getElementById('rc-toast');
  document.getElementById('rc-toast-msg').textContent = msg;
  if (cor) toast.style.background = cor;
  else toast.style.background = '#1a2e1a';

  toast.classList.add('visivel');
  setTimeout(() => toast.classList.remove('visivel'), 3200);
}

// ─── Pulsação do calendário (aviso visual) ────────────────────
function pulsarCalendario() {
  const wrapper = document.querySelector('.wrapper');
  wrapper.style.transition = 'box-shadow 0.15s';
  wrapper.style.boxShadow  = '0 0 0 3px rgba(124,58,237,0.5)';
  setTimeout(() => { wrapper.style.boxShadow = ''; }, 900);
}

// ─── Usuário logado ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem('usuario');
  const btnLogin      = document.getElementById('btnLogin');
  const usuarioLogado = document.getElementById('usuarioLogado');
  const nomeUsuario   = document.getElementById('nomeUsuario');

  if (usuario) {
    if (btnLogin)      btnLogin.style.display = 'none';
    if (usuarioLogado) usuarioLogado.style.display = 'flex';
    if (nomeUsuario)   nomeUsuario.innerText = 'Olá, ' + usuario;
  } else {
    if (usuarioLogado) usuarioLogado.style.display = 'none';
  }
});

function logout() {
  localStorage.removeItem('usuario');
  location.reload();
}
