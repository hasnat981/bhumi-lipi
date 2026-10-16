import { h, icon } from '../dom.js';
import { T } from '../i18n.js';
import { pageHead } from './ui.js';

const STAGES = [
  ['১. পাইলট', '1. Pilot', 'একটি সাব-রেজিস্ট্রি ও এসি ল্যান্ড অফিস', 'One sub-registry office with its AC Land office', 'অফিসভিত্তিক হার্ডওয়্যার চাবি, কর্মকর্তাদের প্রশিক্ষণ, বর্তমান প্রক্রিয়ার সাথে সমান্তরাল পরীক্ষণ।', 'Hardware keys per office, officer training, parallel run beside the existing process, review by staff and experts.'],
  ['২. জেলা', '2. District', 'এক জেলার সব অফিস', 'All offices in one district', 'PostgreSQL, ভূমিকা-ভিত্তিক আসল লগইন, মনিটরিং, অফলাইন-ভেরিফায়েবল QR ও PWA মোড, SMS/USSD।', 'PostgreSQL, role-based real login, monitoring, offline-verifiable QR and low-bandwidth/PWA mode, SMS/USSD.'],
  ['৩. বিভাগ', '3. Division', 'কয়েকটি জেলা ও মন্ত্রণালয়', 'Several districts', 'জাতীয় আইডি ও বিদ্যমান ই-নামজারি পোর্টালে সংযুক্তি; তিন অফিসের সাক্ষী স্বাক্ষরে অ্যাংকর।', 'Integration with national ID and existing land portals; witness co-signing of anchors by three offices.'],
  ['৪. জাতীয়', '4. National', 'সারাদেশের সব ভূমি অফিস', 'All offices nationwide', 'উন্মুক্ত পাবলিক অ্যাংকর, সর্বসাধারণের জন্য স্বাধীন ভেরিফায়ার এবং বাংলা OCR-সহ পুরোনো খতিয়ান ডিজিটাইজ।', 'Shared public anchor, independent verifier for the public, scheduled digitization of old records with Bangla OCR.']
];

const LIMITS = [
  ['একটি ডাটাবেসের হ্যাশ-শিকল "ছোঁয়া গেলে ধরা পড়ে" (tamper-evident), "অভেদ্য" নয়।', 'A single-operator hash chain is tamper-evident, not magically tamper-proof.'],
  ['চাবি চুরি বা ভেতরের লোকের ঝুঁকি আছে। উত্তর: অফিসভিত্তিক চাবি, পাবলিক দৈনিক অ্যাংকর, স্বাধীন ভেরিফায়ার, পরে একাধিক অফিসের সাক্ষী নোড।', 'Key theft and insiders are real risks. Answer: per-office keys, a public daily anchor, an independent verifier, later multi-office witness nodes.'],
  ['ডেমো ভূমিকা আসল লগইন নয়। আসল সিস্টেমে জাতীয় ডিজিটাল আইডি ও হার্ডওয়্যার চাবি লাগবে।', 'Demo roles are not real login. Production needs national digital ID and hardware-held keys.'],
  ['পুরোনো কাগুজে রেকর্ড ডিজিটাইজ (OCR) এখনও করা হয়নি। এটি রোডম্যাপে।', 'Digitizing old paper records (OCR) is not built yet. It is on the roadmap.'],
];

export default async function about() {
  const flow = ['রেজিস্টার|Register', 'সিল|Seal', 'তালা|Lock', 'নামজারি|Mutation', 'যাচাই|Check'];
  return h('div', { class: 'wrap', style: 'padding:32px 20px 0' },
    pageHead(T('ভূমি লিপি সম্পর্কে', 'About Bhumi Lipi'), T('একটি সমস্যা, গভীরভাবে সমাধান: দলিল ও মালিকানা যাচাই (P2), সাথে জালিয়াতি রোধ (P3), নামজারি (P4) ও ক্রেতার যাচাই (P5)।', 'One problem solved deeply: deed and ownership verification (P2), plus fraud rules (P3), mutation (P4) and buyer check (P5).')),
    h('div', { class: 'card' }, h('h3', {}, T('একটি জীবনচক্র, দুই অফিস', 'One lifecycle, two offices')),
      h('p', { class: 'muted' }, T('আজ রেজিস্ট্রেশন (সাব-রেজিস্ট্রি) আর নামজারি (এসি ল্যান্ড) আলাদা কাগজে, আলাদা অফিসে। ভূমি লিপিতে এগুলো একই সিল করা শিকল।', 'Today registration (sub-registry) and mutation (AC Land) are separate papers in separate offices. In Bhumi Lipi they are one sealed chain.')),
      h('div', { class: 'flow-row' }, flow.map((s, i) => [
        h('span', { class: 'flow-pill' },
          h('span', { class: 'flow-num' }, String(i + 1)),
          h('span', { class: 'flow-text' }, T(...s.split('|')))
        ),
        i < flow.length - 1 ? h('span', { class: 'flow-arrow' }, icon('arrow')) : null
      ]))),
    h('div', { class: 'card', style: 'margin-top:18px' },
      h('h3', { style: 'margin-bottom:10px' }, T('সারাদেশে বাস্তবায়নের ৪ ধাপ', 'Plan for countrywide implementation')),
      h('div', { class: 'scroll-x' }, h('table', { class: 't', style: 'min-width:720px' },
        h('thead', {}, h('tr', {}, [['ধাপ', 'Stage'], ['আওতা', 'Scope'], ['প্রধান কাজ', 'Main work']].map(([b, e]) => h('th', {}, T(b, e))))),
        h('tbody', {}, STAGES.map(([stBn, stEn, scBn, scEn, wBn, wEn]) =>
          h('tr', {},
            h('td', {}, h('strong', {}, T(stBn, stEn))),
            h('td', {}, T(scBn, scEn)),
            h('td', {}, T(wBn, wEn)))))))),
    h('div', { class: 'grid g2', style: 'margin-top:18px' },
      h('div', { class: 'card' }, h('h3', {}, T('আমরা নিজেরাই যা বলি: সীমাবদ্ধতা', 'Honest limits (we say them first)')),
        h('ul', { class: 'reasons' }, LIMITS.map(([bn, en]) => h('li', {}, h('span', { class: 'dot amber' }), h('div', {}, T(bn, en)))))),
      h('div', { class: 'card' }, h('h3', {}, T('ডেটা ও প্রযুক্তি', 'Data & technology')),
        h('ul', { class: 'reasons' },
          h('li', {}, icon('shield'), h('div', {}, T('শুধু বানানো ডেটা। আসল নাম, এনআইডি, ফোন বা জমির রেকর্ড নেই। কোনো স্ক্র্যাপিং বা সরকারি সিস্টেম পরীক্ষা নেই।', 'Synthetic data only. No real names, NID, phone numbers or land records. No scraping or testing of government systems.'))),
          h('li', {}, icon('file'), h('div', {}, 'Python (standard library) + cryptography · SQLite · SHA-256 · Ed25519 · Merkle tree · vanilla JS, no framework'))))));
}
