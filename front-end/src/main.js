import { listingById } from './data.js';
import { persist, state } from './state.js';
import { routeParts } from './utils.js';
import { showToast } from './components/shared.js';
import { renderAdmin } from './pages/admin.js';
import { renderApp } from './pages/app.js';
import { renderWeb } from './pages/web.js';
import { renderWebApp } from './pages/web-app.js';

function normalizeRoutePath(path) {
  const raw = `${path || "/web"}`.replace(/^#\/?/, '/');
  return raw.startsWith('/') ? raw : `/${raw}`;
}

function routeTo(path) {
  const nextPath = normalizeRoutePath(path);
  window.history.pushState({}, '', nextPath);
  render();
  window.scrollTo?.(0, 0);
}

function handleRouteClick(target) {
  const route = target.closest('[data-route]')?.dataset.route;
  if (!route) return false;
  routeTo(route);
  return true;
}

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) {
    event.preventDefault();
    handleRouteClick(routeTarget);
    return;
  }

  const saveTarget = event.target.closest('[data-save]');
  if (saveTarget) {
    const id = saveTarget.dataset.save;
    state.saved = state.saved.includes(id) ? state.saved.filter((item) => item !== id) : [...state.saved, id];
    persist();
    render();
    showToast(state.saved.includes(id) ? 'Đã lưu nhà.' : 'Đã bỏ lưu.');
    return;
  }

  const paymentTarget = event.target.closest('[data-payment]');
  if (paymentTarget) {
    state.lastPayment = paymentTarget.dataset.payment;
    persist();
    render();
    showToast(state.lastPayment === 'success' ? 'Đã ghi nhận thanh toán.' : 'Thanh toán chưa thành công.');
    return;
  }

  const adminTarget = event.target.closest('[data-admin-action]');
  if (adminTarget) {
    showToast(`Đã ghi nhận: ${adminTarget.dataset.adminAction}.`);
    return;
  }

  const accountTarget = event.target.closest('[data-account]');
  if (accountTarget) {
    state.notifications = ['Mã OTP demo: 2606', ...state.notifications.slice(0, 4)];
    persist();
    render();
    showToast('Đã gửi OTP demo.');
  }
});

document.addEventListener('submit', (event) => {
  const searchFormNode = event.target.closest('[data-search-form]');
  if (searchFormNode) {
    event.preventDefault();
    const data = new FormData(searchFormNode);
    state.filters = {
      keyword: data.get('keyword') || '',
      district: data.get('district') || 'Tất cả',
      budget: data.get('budget') || 'Tất cả'
    };
    persist();
    const targetRoute = searchFormNode.dataset.targetRoute || '/web/search';
    routeTo(targetRoute);
    return;
  }

  const bookingForm = event.target.closest('[data-booking-form]');
  if (bookingForm) {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const listingId = bookingForm.dataset.bookingForm;
    state.bookings = [
      {
        id: `BK-${Date.now().toString().slice(-4)}`,
        listingId,
        date: data.get('date') || 'Thứ 7, 22/06',
        time: data.get('time') || '09:00 - 11:00',
        status: 'Chờ chủ nhà xác nhận'
      },
      ...state.bookings
    ];
    state.notifications = [`Đã gửi yêu cầu đặt lịch ${listingById(listingId).title}.`, ...state.notifications.slice(0, 4)];
    persist();
    const successRoute = bookingForm.dataset.successRoute || '/web/payments';
    routeTo(successRoute);
    showToast('Đã tạo lịch xem.');
    return;
  }

  const messageForm = event.target.closest('[data-message-form]');
  if (messageForm) {
    event.preventDefault();
    const input = messageForm.querySelector("input[name='message']");
    const body = input?.value?.trim();
    if (body) {
      state.messages = [...state.messages, { from: 'Bạn', body }];
      persist();
      render();
      showToast('Đã gửi tin nhắn.');
    }
    return;
  }

  const postForm = event.target.closest('[data-post-form]');
  if (postForm) {
    event.preventDefault();
    showToast('Đã lưu tin nháp. Chuyển sang Owner Center.');
    routeTo('/web/owner');
  }
});

function render() {
  const [area, path, id] = routeParts();
  if (area === 'admin') return renderAdmin(path || 'overview');
  if (area === 'web_app') return renderWebApp(path || 'dashboard', id);
  if (area === 'app' || area === 'mobile') return renderApp(path || 'home', id);
  return renderWeb(path || 'home', id);
}

window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);
render();
