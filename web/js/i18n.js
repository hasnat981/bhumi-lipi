// Language state. T(bn, en) picks the text for the current language.
// Server messages arrive as {bn, en}; LL(obj) picks one.
export const state = { lang: 'bn', role: 'citizen', theme: 'auto', size: '100', contrast: 'normal' };

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked: keep going */ } },
};

export function loadState() {
  const lang = store.get('bl.lang'), role = store.get('bl.role'), theme = store.get('bl.theme');
  const size = store.get('bl.size'), contrast = store.get('bl.contrast');
  if (lang === 'bn' || lang === 'en') state.lang = lang;
  if (['citizen', 'registrar', 'ac_land', 'bank'].includes(role)) state.role = role;
  if (['auto', 'light', 'dark'].includes(theme)) state.theme = theme;
  if (['100', '125', '150'].includes(size)) state.size = size;
  if (['normal', 'high'].includes(contrast)) state.contrast = contrast;
  applyTheme();
  document.documentElement.lang = state.lang;
}
export function setLang(l) { state.lang = l; store.set('bl.lang', l); document.documentElement.lang = l; }
export function setRole(r) { state.role = r; store.set('bl.role', r); }
export function setTheme(t) { state.theme = t; store.set('bl.theme', t); applyTheme(); }
export function setSize(v) { state.size = v; store.set('bl.size', v); applyTheme(); }
export function setContrast(v) { state.contrast = v; store.set('bl.contrast', v); applyTheme(); }
export const getView = () => store.get('bl.view');
export const setView = (v) => store.set('bl.view', v);
function applyTheme() {
  document.documentElement.style.setProperty('--scale', String(Number(state.size) / 100));
  document.documentElement.setAttribute('data-scale', state.size);
  if (state.contrast === 'high') document.documentElement.setAttribute('data-contrast', 'high');
  else document.documentElement.removeAttribute('data-contrast');
  if (state.theme === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', state.theme);
}

export const T = (bn, en) => (state.lang === 'bn' ? bn : en);
export const LL = (o) => (o ? (state.lang === 'bn' ? o.bn : o.en) : '');

const locale = () => (state.lang === 'bn' ? 'bn-BD' : 'en-GB');
export const fmtDate = (ts) => new Intl.DateTimeFormat(locale(), { dateStyle: 'medium' }).format(new Date(ts * 1000));
export const fmtDateTime = (ts) => new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts * 1000));
export const fmtMoney = (n) => `৳ ${Number(n).toLocaleString(state.lang === 'bn' ? 'bn-BD' : 'en-US')}`;
export const fmtNum = (n) => Number(n).toLocaleString(state.lang === 'bn' ? 'bn-BD' : 'en-US');
export const shortHash = (h) => (h ? `${h.slice(0, 10)}…${h.slice(-6)}` : '');
