// App shell + hash router. Each page is a module in views/ that exports a default async function.
import { h, $, clear, icon, skeleton } from './dom.js';
import { state, loadState, setLang, setRole, setTheme, setSize, T } from './i18n.js';
import { initCommandPaletteShortcuts } from './components/command-palette.js';

const VER = '1.0.1';
const ROUTES = [
  [/^\/$/, 'home', () => import(`./views/home.js?v=${VER}`)],
  [/^\/check(?:\/([^/]+))?$/, 'check', () => import(`./views/check.js?v=${VER}`)],
  [/^\/verify$/, 'verify', () => import(`./views/verify.js?v=${VER}`)],
  [/^\/v\/([0-9a-fA-F]{64})$/, 'verify', () => import(`./views/verify.js?v=${VER}`)],
  [/^\/registrar$/, 'registrar', () => import(`./views/registrar.js?v=${VER}`)],
  [/^\/mutation(?:\/([^/]+))?$/, 'mutation', () => import(`./views/mutation.js?v=${VER}`)],
  [/^\/bank$/, 'bank', () => import(`./views/bank.js?v=${VER}`)],
  [/^\/integrity$/, 'integrity', () => import(`./views/integrity.js?v=${VER}`)],
  [/^\/lab$/, 'lab', () => import(`./views/lab.js?v=${VER}`)],
  [/^\/about$/, 'about', () => import(`./views/about.js?v=${VER}`)],
];
const NAV = [
  ['check', '/check', 'জমি দেখুন', 'Check'], ['verify', '/verify', 'দলিল যাচাই', 'Verify'],
  ['registrar', '/registrar', 'রেজিস্ট্রার', 'Registrar'], ['mutation', '/mutation', 'নামজারি', 'Mutation'],
  ['bank', '/bank', 'ব্যাংক', 'Bank'], ['integrity', '/integrity', 'সুরক্ষা', 'Integrity'],
  ['lab', '/lab', 'অ্যাটাক ল্যাব', 'Lab'], ['about', '/about', 'পরিচিতি', 'About'],
];
const ROLE_LABELS = { citizen: ['নাগরিক', 'Citizen'], registrar: ['সাব-রেজিস্ট্রার', 'Sub-registrar'], ac_land: ['এসি ল্যান্ড', 'AC Land'], bank: ['ব্যাংক', 'Bank'] };

let current = 'home', leaveFns = [], token = 0;
export const navigate = (path) => { location.hash = '#' + path; };
const ctx = { onLeave: (fn) => leaveFns.push(fn), navigate, rerender: () => route() };

function shell() {
  const top = clear($('#top'));
  const nav = h('nav', { class: 'nav', 'aria-label': T('প্রধান মেনু', 'Main menu') },
    NAV.map(([id, path, bn, en]) => h('a', { href: '#' + path, 'aria-current': id === current ? 'page' : null }, T(bn, en))));
  const roleSel = h('select', { id: 'role', 'aria-label': T('ডেমো ভূমিকা', 'Demo role'), onchange: (e) => { setRole(e.target.value); shell(); route(); } },
    Object.entries(ROLE_LABELS).map(([v, l]) => h('option', { value: v, selected: v === state.role }, T(l[0], l[1]))));
  const isDark = state.theme === 'dark';
  const themeBtn = h('button', {
    class: 'iconbtn',
    id: 'themebtn',
    'aria-label': isDark ? T('উজ্জ্বল মোডে যান', 'Switch to bright mode') : T('ডার্ক মোডে যান', 'Switch to dark mode'),
    title: isDark ? T('উজ্জ্বল মোড', 'Bright mode') : T('ডার্ক মোড', 'Dark mode'),
    onclick: () => {
      setTheme(isDark ? 'light' : 'dark');
      shell();
    }
  }, icon(isDark ? 'sun' : 'moon'));
  top.append(h('div', { class: 'wrap' },
    h('a', { class: 'brand', href: '#/', 'aria-label': 'Bhumi Lipi home' },
      h('img', { src: '/assets/logo.png', alt: '' }),
      h('span', { class: 'brand-text' },
        h('span', { class: 'brand-title' }, 'ভূমি লিপি'),
        h('small', { class: 'brand-sub' }, 'Bhumi Lipi'))),
    nav,
    h('div', { class: 'tools' },
      h('label', { class: 'rolepill', for: 'role' }, icon('user'), h('span', {}, T('ভূমিকা', 'Role'))), roleSel,
      h('button', { class: 'iconbtn', 'aria-label': T('ভাষা বদলান', 'Switch language'), onclick: () => { setLang(state.lang === 'bn' ? 'en' : 'bn'); shell(); route(); } }, state.lang === 'bn' ? 'EN' : 'বাং'),
      h('button', { class: 'iconbtn', id: 'sizebtn', 'data-size': state.size, 'aria-label': T(`লেখার আকার: ${state.size}%`, `Text size: ${state.size}%`), title: T('লেখার আকার', 'Text size'),
        onclick: () => { setSize({ 100: '125', 125: '150', 150: '100' }[state.size]); shell(); } }, h('span', { style: 'font-weight:700' }, 'A', h('small', { style: 'font-size:.7em' }, state.size === '100' ? 'a' : '+'))),
      themeBtn)));
  $('#demobar').textContent = T('ডেমো: সব তথ্য বানানো। কোনো আসল নাম, এনআইডি বা জমির রেকর্ড নেই।', 'Demo: all data is synthetic. No real names, NID numbers or land records.');
  $('#skip').textContent = T('মূল অংশে যান', 'Skip to content');
  clear($('#footer')).append(h('div', { class: 'wrap row' },
    h('div', { class: 'grow' }, h('strong', {}, 'ভূমি লিপি · Bhumi Lipi'), h('p', { class: 'small' },
      T('LandTech Innovation Hackathon 2026 · ডিজিটাল ভূমি রেকর্ড, যাচাই ও ডিজিটাইজেশন।',
        'LandTech Innovation Hackathon 2026 · Digital land records, verification and digitization.'))),
    h('div', { class: 'small' }, h('a', { href: '/tools/verify_anchor.py' }, T('স্বাধীন ভেরিফায়ার স্ক্রিপ্ট', 'Independent verifier script')))));

  let tabbar = document.getElementById('tabbar');
  if (!tabbar) {
    tabbar = h('nav', { class: 'mobile-tab-bar noprint', id: 'tabbar', 'aria-label': T('মোবাইল মেনু', 'Mobile menu') });
    document.body.append(tabbar);
  }
  clear(tabbar).append(
    h('a', { href: '#/check', class: current === 'check' ? 'is-active' : '' }, icon('search'), h('span', {}, T('যাচাই', 'Check'))),
    h('a', { href: '#/mutation', class: current === 'mutation' ? 'is-active' : '' }, icon('clock'), h('span', {}, T('নামজারি', 'Track'))),
    h('a', { href: '#/verify', class: `tab-raised ${current === 'verify' ? 'is-active' : ''}` }, icon('scan'), h('span', {}, T('স্ক্যান', 'Scan'))),
    h('a', { href: '#/integrity', class: current === 'integrity' ? 'is-active' : '' }, icon('shield'), h('span', {}, T('সুরক্ষা', 'Trust'))),
    h('a', { href: '#/about', class: current === 'about' ? 'is-active' : '' }, icon('info'), h('span', {}, T('তথ্য', 'About')))
  );
}

async function route() {
  const my = ++token;
  leaveFns.forEach((f) => { try { f(); } catch { /* ignore */ } });
  leaveFns = [];
  const path = (location.hash.slice(1) || '/').split('?')[0];
  let hit = null;
  for (const [rx, nav, load] of ROUTES) { const m = rx.exec(path); if (m) { hit = { nav, load, params: m.slice(1) }; break; } }
  current = hit ? hit.nav : 'home';
  shell();
  const main = clear($('#main'));
  if (!hit) hit = { nav: 'home', load: ROUTES[0][2], params: [] };
  main.append(skeleton());
  try {
    const mod = await hit.load();
    const node = await mod.default(hit.params, ctx);
    if (my !== token) return;
    clear(main).append(node);
  } catch (e) {
    if (my !== token) return;
    console.error(e);
    clear(main).append(h('div', { class: 'wrap', style: 'padding:48px 20px' }, h('div', { class: 'card empty' },
      h('h2', {}, T('কিছু ভুল হয়েছে', 'Something went wrong')), h('p', {}, e.error ? (state.lang === 'bn' ? e.error.bn : e.error.en) : String(e.message || e)),
      h('button', { class: 'btn', onclick: () => { window.location.reload(); } }, T('আবার চেষ্টা করুন', 'Try again')))));
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
  main.focus({ preventScroll: true });
}

// Pretty URLs from the server (/check/ID) become hash routes
if (location.pathname !== '/' && location.pathname.length > 1) location.replace('/#' + location.pathname + location.search);
loadState();
initCommandPaletteShortcuts(ctx);
window.addEventListener('hashchange', route);
route();
