# Bhumi Lipi: Concept Note
**LandTech Innovation Hackathon 2026 · Track: Digital Land Records, Verification & Digitization**

| Parameter | Details |
| :--- | :--- |
| **Selected Problem** | **P2: Deed & Ownership Verification**, with P3 (fraud and double-sale), P4 (registration to e-Mutation) and P5 (citizen check) as supporting features. |
| **One-Line Pitch** | Every land deed gets a tamper-evident digital seal, so anyone can verify ownership in 10 seconds and the same land cannot be sold twice. |
| **Status** | Working prototype, synthetic data only. Public repo with README, 53 automated tests and browser end-to-end tests. Live link and 3-minute demo video submitted. |

---

## 1. The Problem and Why It Matters in Bangladesh

Land disputes account for a staggering majority of civil court cases in Bangladesh. Most disputes stem from four systemic vulnerabilities:
1. **Forged or altered deeds:** Paper deeds are trivial to counterfeit or alter, and extremely slow and bureaucratic to verify with official volume registers.
2. **The same land sold twice (Double selling):** Deed registration happens at the Sub-Registry Office (Ministry of Law), while mutation happens weeks or months later at the AC Land Office (Ministry of Land). In this gap, there is no technical lock preventing a fraudulent second sale or illicit mortgage.
3. **Records that do not match:** Historic land surveys (CS, SA, RS, BS) often conflict, and disparate offices operate in administrative silos without shared cryptographic truth.
4. **Buyers cannot check:** Ordinary citizens, expatriate buyers, and banks lack a fast, independent, plain-language way to verify true ownership before handing over life savings.

**Why P2 is the Core:** Deed verification is the foundational building block. When a deed can be mathematically proven Genuine, Outdated, or Forged in under 10 seconds, forgery and fraudulent reselling lose their primary operating vector. P3 (fraud prevention), P4 (seamless mutation), and P5 (citizen verification) operate naturally on top of this sealed ledger.

---

## 2. Proposed Solution: The Sealed Lifecycle

Bhumi Lipi integrates Sub-Registry and AC Land into a unified, cryptographically locked, 5-stage lifecycle:

```
[1. Register] ──▶ [2. Seal] ──▶ [3. Lock] ──▶ [4. e-Mutation] ──▶ [5. Check]
 Sub-Registrar     Hash + Sig     No 2nd Sale      Auto-checks      Public QR/ID
```

- **1. Register & Seal:** Each deed becomes an immutable block containing a SHA-256 hash of all canonical transaction fields, the document content hash (`doc_hash`), and the cryptographic hash of the previous block for that parcel. It is digitally signed with the Sub-Registry office’s private Ed25519 key.
- **2. Automatic Lock:** Upon registration, the parcel status automatically locks. Any attempt at a duplicate sale, fake seller transfer, or sale of mortgaged or government (khas/vested/acquired) land is immediately halted by rules with clear explanations in Bangla and English.
- **3. Seamless e-Mutation:** Registration automatically triggers e-mutation with a public tracking ID and eight automated validation checks (signature, seller ownership, encumbrances/liens, court stay orders, survey area consistency, price fairness, rapid resale, and government land filters). The AC Land officer can approve in one click. A rejection records an append-only `REVERSAL` block so history is never deleted.
- **4. Instant Citizen Check:** Citizens, banks, and legal personnel verify records via a simple Green/Amber/Red verdict, scan a QR code, or drag-and-drop the deed file to verify character-level integrity.
- **5. Public Merkle Anchor:** Daily Merkle root anchors are published externally. An independent verifier script (`verify_anchor.py`) allows third parties to audit the chain without trusting the server operator.

### Global Technology Lessons Adapted for Bangladesh
| Country | Technology Used | Real-World Limitation | Bhumi Lipi Low-Cost Adaptation |
| :--- | :--- | :--- | :--- |
| **Georgia** | Public blockchain ledger | Gas fees, volatile crypto, complex infra | Office signatures + hash chain + public Merkle anchor (Zero gas, zero coins). |
| **India** | Drone mapping & GIS (SVAMITVA) | Maps alone do not halt forged deed sales | Unified plot ID binding deeds, historical surveys (CS/SA/RS/BS), and shares. |
| **Rwanda** | Nationwide GIS demarcation | Discrepancies discovered post-dispute | Survey area mismatches and boundaries flagged automatically at registration. |
| **Estonia** | X-Road data layer + digital ID | Heavy prerequisite of universal national digital ID | Role-based cryptographic access working with current office structures today. |
| **Zambia** | Blockchain + mobile GPS mapping | Low smartphone/data access in rural areas | Low-data, mobile-first Bengali UI, Simple mode for elders, printable offline QR. |

---

## 3. System Architecture & Technology Stack

- **Cryptographic Engine:** Pure SHA-256 hash chaining, Ed25519 digital signatures (via Python `cryptography`), and Merkle tree inclusion proofs. No home-made crypto.
- **Backend Service:** Python 3 standard library HTTP service and SQLite with append-only database triggers and fork guards. Single dependency, minimal attack surface, fully explainable.
- **Frontend Interface:** Lightweight Vanilla JavaScript (ES modules, zero build step, no bloated framework), accessible semantic CSS with Bengali typography (Hind Siliguri, Fraunces, Roboto Mono). Fully responsive down to 360px mobile viewports.
- **Accessibility & Inclusion:** **Simple Mode** designed for elderly and rural citizens featuring 3-word shape verdicts (Green Shield "এগোন / Go ahead", Amber Triangle "সাবধান / Careful", Red Octagon "থামুন / Stop"), 100%/125%/150% font scaling, high-contrast theme, and Ana-Gonda traditional land share calculator.
- **Security Posture:** Strict Content-Security-Policy (CSP), `textContent`-only DOM rendering (zero XSS), per-client rate limiting, path-traversal protection, and hashed audit logs. Detailed in `docs/THREAT_MODEL.md`.
- **Quality Assurance:** 53 automated unit/integration tests (`python -m unittest discover -s tests -t .`) and end-to-end Playwright browser automation suite.

---

## 4. Key Working Features (All Tested in Prototype)

| Feature | Problem Addressed | Status |
| :--- | :--- | :--- |
| **Cryptographic Hash-Chain Registry** | P2 (Tamper-evident record keeping) | Fully Working (53 tests pass) |
| **Multi-Method Deed Verification** (QR, Hash, Deed File Upload, Interactive Diff) | P2 (Immediate fraud detection) | Fully Working |
| **11 Explainable Fraud Detection Rules** with 0-100 Risk Score | P3 (Double sale, fake seller, rapid flip) | Fully Working |
| **Automated Plot Lock & e-Mutation Pipeline** with 8 Auto-checks | P4 (Eliminates registration-mutation gap) | Fully Working |
| **Citizen Check Report** (Bangla/English, survey history, printable title report) | P5 (Buyer due-diligence) | Fully Working |
| **Bank Lien & Collateral Mortgage Registry** | P3 (Double mortgage prevention) | Fully Working |
| **Public Merkle Root & Independent Verifier Script** | P2 (Tamper detection against malicious insiders) | Fully Working |
| **Interactive Attack Lab** (5 simulated insider & forgery attacks) | All (Transparent security testing) | Fully Working |

---

## 5. Nationwide Applicability & Rollout Strategy

1. **Phase 1 (Single Upazila Pilot):** Deploy with 1 Sub-Registry Office and 1 AC Land Office using synthetic seed data to train officers and validate workflow ergonomics.
2. **Phase 2 (District & Financial Integration):** Integrate local bank branches for automated mortgage lien recording, blocking double mortgaging.
3. **Phase 3 (Government API Gateway):** Interconnect with the national e-Mutation portal and digital survey databases via lightweight REST APIs.
4. **Phase 4 (National Scale):** Transition to multi-office hardware security module (HSM) keys and distributed witness node anchoring across administrative divisions.

**Economic Feasibility:** The architecture avoids expensive blockchain gas fees, vendor lock-in, and proprietary software licenses. Operational costs are strictly standard server hosting and officer training.

---

## 6. Team, Mentors & Compliance

| Role | Name | Institution / ID |
| :--- | :--- | :--- |
| **Student Member (Team Leader)** | Mohammad Abrar Hasnat | DIU ID: 253-15-689 |
| **Student Member** | [Second Student Member Name] | [Institution / ID] |
| **Faculty Mentor** | [Assigned by Organizers] | [Department / Institution] |
| **Industry Mentor** | [Assigned by Organizers] | [Organization / Designation] |

**Ethical Compliance & Data Statement:** All records in Bhumi Lipi are strictly synthetic. No real citizen names, NIDs, phone numbers, or actual government land records were scraped, tested, or stored. All code is open-source under the MIT license.
