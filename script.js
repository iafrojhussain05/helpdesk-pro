'use strict';

const STORAGE_KEY = 'helpdeskProTicketsV1';
const STATUSES = ['Open', 'In Progress', 'Resolved'];
const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account & Login', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const elements = {
  totalCount: document.getElementById('totalCount'),
  openCount: document.getElementById('openCount'),
  progressCount: document.getElementById('progressCount'),
  resolvedCount: document.getElementById('resolvedCount'),
  tableBody: document.getElementById('ticketTableBody'),
  emptyState: document.getElementById('emptyState'),
  emptyMessage: document.getElementById('emptyMessage'),
  resultsCount: document.getElementById('resultsCount'),
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  categoryFilter: document.getElementById('categoryFilter'),
  ticketForm: document.getElementById('ticketForm'),
  requesterName: document.getElementById('requesterName'),
  issueTitle: document.getElementById('issueTitle'),
  issueDescription: document.getElementById('issueDescription'),
  issueCategory: document.getElementById('issueCategory'),
  issuePriority: document.getElementById('issuePriority'),
  ticketDetailsBody: document.getElementById('ticketDetailsBody'),
  detailTicketId: document.getElementById('detailTicketId'),
  detailsModalLabel: document.getElementById('detailsModalLabel'),
  toast: document.getElementById('appToast'),
  toastMessage: document.getElementById('toastMessage')
};

const ticketModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('ticketModal'));
const detailsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('detailsModal'));
const toast = bootstrap.Toast.getOrCreateInstance(elements.toast, { delay: 2600 });

function makeSeedTickets() {
  const now = Date.now();
  return [
    { id: 'HD-1001', requester: 'Aditi Sharma', title: 'Laptop cannot connect to Wi-Fi', description: 'The laptop can see the office network but fails to connect. Restarting the device did not resolve the issue.', category: 'Network', priority: 'High', status: 'Open', createdAt: new Date(now - 1000 * 60 * 45).toISOString() },
    { id: 'HD-1002', requester: 'Rahul Verma', title: 'Unable to sign in to email', description: 'The user receives a sign-in error while accessing their work email account.', category: 'Account & Login', priority: 'Critical', status: 'In Progress', createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString() },
    { id: 'HD-1003', requester: 'Neha Singh', title: 'Office application not opening', description: 'The spreadsheet application closes shortly after launch.', category: 'Software', priority: 'Medium', status: 'Open', createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'HD-1004', requester: 'Karan Mehta', title: 'Keyboard replacement request', description: 'Several keys are not responding consistently during typing.', category: 'Hardware', priority: 'Low', status: 'Resolved', createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString() }
  ];
}

function loadTickets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const starter = makeSeedTickets();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isValidTicket) : [];
  } catch (error) {
    console.error('Could not load saved tickets:', error);
    showToast('Browser storage could not be read. The app may be in private or restricted mode.');
    return makeSeedTickets();
  }
}

function isValidTicket(ticket) {
  return ticket && typeof ticket.id === 'string' && typeof ticket.title === 'string' &&
    typeof ticket.requester === 'string' && STATUSES.includes(ticket.status) &&
    CATEGORIES.includes(ticket.category) && PRIORITIES.includes(ticket.priority);
}

let tickets = loadTickets();

function saveTickets() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error('Could not save tickets:', error);
    showToast('Could not save changes in this browser. Check storage permissions.');
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function statusClass(status) {
  if (status === 'In Progress') return 'status-progress';
  if (status === 'Resolved') return 'status-resolved';
  return 'status-open';
}

function priorityClass(priority) {
  return `priority-${priority.toLowerCase()}`;
}

function filteredTickets() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const category = elements.categoryFilter.value;

  return tickets.filter((ticket) => {
    const searchable = [ticket.id, ticket.requester, ticket.title, ticket.description, ticket.category, ticket.priority, ticket.status].join(' ').toLowerCase();
    return (!query || searchable.includes(query)) &&
      (status === 'all' || ticket.status === status) &&
      (category === 'all' || ticket.category === category);
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateStats() {
  elements.totalCount.textContent = tickets.length;
  elements.openCount.textContent = tickets.filter((ticket) => ticket.status === 'Open').length;
  elements.progressCount.textContent = tickets.filter((ticket) => ticket.status === 'In Progress').length;
  elements.resolvedCount.textContent = tickets.filter((ticket) => ticket.status === 'Resolved').length;
}

function renderTickets() {
  const visibleTickets = filteredTickets();
  elements.tableBody.innerHTML = visibleTickets.map((ticket) => `
    <tr>
      <td>
        <div class="ticket-title">${escapeHTML(ticket.title)}</div>
        <div class="ticket-id">${escapeHTML(ticket.id)}</div>
      </td>
      <td><span class="requester">${escapeHTML(ticket.requester)}</span></td>
      <td><span class="category-tag">${escapeHTML(ticket.category)}</span></td>
      <td><span class="${priorityClass(ticket.priority)} fw-semibold">${escapeHTML(ticket.priority)}</span></td>
      <td><span class="pill ${statusClass(ticket.status)}">${escapeHTML(ticket.status)}</span></td>
      <td class="text-secondary text-nowrap">${escapeHTML(formatDate(ticket.createdAt))}</td>
      <td class="text-end text-nowrap">
        <div class="dropdown d-inline-block">
          <button class="action-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Actions for ${escapeHTML(ticket.id)}"><i class="bi bi-three-dots"></i></button>
          <ul class="dropdown-menu dropdown-menu-end action-menu">
            <li><button class="dropdown-item" type="button" data-action="view" data-id="${escapeHTML(ticket.id)}"><i class="bi bi-eye me-2"></i>View details</button></li>
            ${STATUSES.filter((status) => status !== ticket.status).map((status) => `<li><button class="dropdown-item" type="button" data-action="status" data-status="${escapeHTML(status)}" data-id="${escapeHTML(ticket.id)}"><i class="bi bi-arrow-repeat me-2"></i>Mark ${escapeHTML(status)}</button></li>`).join('')}
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" type="button" data-action="delete" data-id="${escapeHTML(ticket.id)}"><i class="bi bi-trash me-2"></i>Delete ticket</button></li>
          </ul>
        </div>
      </td>
    </tr>`).join('');

  const hasTickets = visibleTickets.length > 0;
  elements.emptyState.classList.toggle('d-none', hasTickets);
  elements.tableBody.closest('table').classList.toggle('d-none', !hasTickets);
  elements.resultsCount.textContent = `Showing ${visibleTickets.length} of ${tickets.length} ticket${tickets.length === 1 ? '' : 's'}`;
  if (!tickets.length) {
    elements.emptyMessage.textContent = 'Create your first ticket to start tracking support requests.';
  } else {
    elements.emptyMessage.textContent = 'Try a different search or filter to find a ticket.';
  }
  updateStats();
}

function generateTicketId() {
  const highest = tickets.reduce((max, ticket) => {
    const match = /^HD-(\d+)$/.exec(ticket.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);
  return `HD-${highest + 1}`;
}

function showToast(message) {
  elements.toastMessage.textContent = message;
  if (typeof bootstrap !== 'undefined' && elements.toast) toast.show();
}

function openTicketDetails(id) {
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) return;
  elements.detailTicketId.textContent = ticket.id;
  elements.detailsModalLabel.textContent = ticket.title;
  elements.ticketDetailsBody.innerHTML = `
    <div class="row g-3">
      <div class="col-6"><div class="detail-block"><div class="detail-label">Requester</div><div class="detail-value">${escapeHTML(ticket.requester)}</div></div></div>
      <div class="col-6"><div class="detail-block"><div class="detail-label">Created</div><div class="detail-value">${escapeHTML(formatDate(ticket.createdAt))}</div></div></div>
      <div class="col-6"><div class="detail-block"><div class="detail-label">Category</div><div class="detail-value">${escapeHTML(ticket.category)}</div></div></div>
      <div class="col-6"><div class="detail-block"><div class="detail-label">Priority / Status</div><div class="detail-value">${escapeHTML(ticket.priority)} / ${escapeHTML(ticket.status)}</div></div></div>
      <div class="col-12"><div class="detail-block"><div class="detail-label">Description</div><div class="detail-value">${escapeHTML(ticket.description).replace(/\n/g, '<br>')}</div></div></div>
    </div>`;
  detailsModal.show();
}

function handleTicketAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, id, status } = button.dataset;
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) return;

  if (action === 'view') {
    openTicketDetails(id);
    return;
  }
  if (action === 'status') {
    const previousStatus = ticket.status;
    ticket.status = status;
    if (saveTickets()) {
      renderTickets();
      showToast(`${id} moved from ${previousStatus} to ${status}.`);
    }
    return;
  }
  if (action === 'delete') {
    const confirmed = window.confirm(`Delete ${id} — ${ticket.title}? This cannot be undone.`);
    if (!confirmed) return;
    tickets = tickets.filter((item) => item.id !== id);
    if (saveTickets()) {
      renderTickets();
      showToast(`${id} deleted.`);
    }
  }
}

elements.ticketForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!elements.ticketForm.reportValidity()) return;

  const newTicket = {
    id: generateTicketId(),
    requester: elements.requesterName.value.trim(),
    title: elements.issueTitle.value.trim(),
    description: elements.issueDescription.value.trim(),
    category: elements.issueCategory.value,
    priority: elements.issuePriority.value,
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  if (!newTicket.requester || !newTicket.title || !newTicket.description) {
    showToast('Please complete all required fields.');
    return;
  }

  tickets.unshift(newTicket);
  if (saveTickets()) {
    elements.ticketForm.reset();
    elements.issueCategory.value = 'Hardware';
    elements.issuePriority.value = 'Medium';
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    elements.categoryFilter.value = 'all';
    ticketModal.hide();
    renderTickets();
    showToast(`Ticket ${newTicket.id} created successfully.`);
  } else {
    tickets = tickets.filter((ticket) => ticket.id !== newTicket.id);
  }
});

elements.tableBody.addEventListener('click', handleTicketAction);
elements.searchInput.addEventListener('input', renderTickets);
elements.statusFilter.addEventListener('change', renderTickets);
elements.categoryFilter.addEventListener('change', renderTickets);

document.getElementById('resetDemoBtn').addEventListener('click', () => {
  const confirmed = window.confirm('Reset all tickets to the original demo data? Your current browser-stored changes will be lost.');
  if (!confirmed) return;
  tickets = makeSeedTickets();
  if (saveTickets()) {
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    elements.categoryFilter.value = 'all';
    renderTickets();
    showToast('Demo data has been reset.');
  }
});

renderTickets();
