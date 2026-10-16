# Bhumi Lipi
### Tamper-evident deed verification and a linked registration-to-mutation workflow
**LandTech Innovation Hackathon 2026 · Round 1 Concept Note · Track: Digital Land Records, Verification & Digitization**

| Parameter | Details |
| :--- | :--- |
| **Chosen problem statement** | **P2 - Deed & Ownership Verification (main)**. Supporting features from P3 (fraud and double-selling detection), P4 (smart e-mutation workflow) and P5 (citizen pre-purchase verification), built as one lifecycle. |
| **Prototype status** | Working prototype on 100% synthetic data. 53 automatic tests, a real-browser walkthrough and an independent verifier script. |

---

## 1. The problem in Bangladesh
Land disputes are among the most common civil cases in Bangladesh. Many trace back to three weaknesses in how records are kept and checked:
- **Forged or altered deeds.** A paper deed or a photocopy is hard to verify on the spot; buyers and banks usually depend on brokers.
- **The same plot sold twice.** Registration happens at the sub-registry office and mutation at the AC Land office. In the gap between the two, a plot can be sold again, and nobody is accountable for how long mutation waits.
- **Hard-to-read records for ordinary citizens.** Survey generations (CS, SA, RS, BS) and area units (ana, gonda) are confusing, and many people have low literacy or limited digital skill.

Bhumi Lipi addresses these within the rule book's own problem statements, rather than adding unrelated features.

---

## 2. Proposed solution
Every registered sale becomes a **signed record in a per-plot hash chain**. Each record is hashed with SHA-256 and signed with Ed25519 (one key per office). A QR seal on the deed leads to a public check page. Anyone can verify a deed copy and get one of three results: **Genuine**, **Outdated** (a valid old deed, but a newer record exists) or **Forged** (the file or seal does not match the registry).

The same system links registration to mutation: when a sale is registered, the plot is **locked** and a mutation case starts automatically, with **8 automatic checks**, a tracking ID and an officer queue. The lock stays until the AC Land officer approves the mutation. Citizens see the result as a Green / Amber / Red report in Bangla or English.

---

## 3. Key features (all built and tested)
| Area | What it does |
| :--- | :--- |
| **Verification (P2)** | Signed hash chain, append-only database triggers, chain guard, QR seal, deed-file fingerprint check, three verify results. |
| **Fraud detection (P3)** | 11 explainable rules with a risk score, in Bangla and English: fake-seller and double-sale blocks, government-land block, rapid-transfer and survey-mismatch warnings, one active lien per plot (double-mortgage block). |
| **Smart mutation (P4)** | Auto-start after registration, 8 automatic checks, tracking ID, officer queue, reversal records, and a waiting-days chip (amber at 14 days, red at 30 days) so delays are visible. |
| **Citizen check (P5)** | Green/Amber/Red report, ownership history, survey table, printable title report. Simple mode for elders and low-literacy users: three-word shape verdicts (Go ahead / Careful / Stop), large text, high contrast, read-aloud when the device has a Bangla voice, and an ana-gonda to decimal helper. |
| **Trust** | Periodic public Merkle anchor, in-browser proof check, independent verifier script that does not import the app, and an Attack Lab that runs 5 attacks on a private copy (never on the live data). |

---

## 4. System architecture and tech stack
| Layer | Technology and role |
| :--- | :--- |
| **Browser** | Vanilla JavaScript, no build step. Views: Check, Verify, Registrar, Mutation, Bank, Integrity, Lab, About. Bangla and English. Text is inserted with textContent; strict content security policy. |
| **HTTP layer** | Python standard library server: JSON API, demo roles, rate limit, request-size cap, security headers, path-traversal-safe static files. |
| **Service layer** | Framework-free Python: register sale, check plot, verify, decide mutation, liens, integrity, anchor, lab. A framework such as FastAPI can replace only the API file later. |
| **Crypto and rules** | SHA-256, Ed25519 per office, Merkle tree. Rules are pure functions with Bangla and English messages, so each decision can be explained. |
| **Database** | SQLite for the prototype (PostgreSQL planned). Append-only triggers on blocks, anchors, mutation events and audit log, plus a chain-guard trigger, so the database itself enforces the rules. |
| **Delivery** | Dockerfile, render.yaml, CI, README, SPEC, threat model, demo script. One third-party dependency: cryptography. |

**Design principles.** The sealed block format is frozen, so changes are additive only (new columns, tables and rule entries). Unfinished features ship behind feature flags. The verifier ignores unknown fields, so old exports stay checkable as the system grows.

**Honest security claim.** The system is tamper-evident, not tamper-proof: any edit to history is detected by the chain check, the public anchor and the independent verifier. Demo roles stand in for national digital ID and are not real login.

---

## 5. How it fits international practice at low cost
Public descriptions of land systems in Georgia (title fingerprints on a public ledger), Estonia (hash-tree integrity between registries), India (one ID per parcel) and Rwanda (systematic parcel registration) informed the design. Bhumi Lipi adapts the ideas without per-transaction chain fees: office signatures and a hash chain give the proof, and only a periodic Merkle root is published. The software stack is open source. The real cost drivers are hosting, database, hardware keys per office, officer training and the people-time to digitize old records. We have not measured cost savings and make no savings claim.

---

## 6. Plan for countrywide implementation
| Stage | Scope | Main work |
| :--- | :--- | :--- |
| **1. Pilot** | One sub-registry office with its AC Land office | Hardware keys per office, officer training, parallel run beside the existing process, review by land-office staff and law experts. |
| **2. District** | All offices in one district | PostgreSQL, role-based real login, monitoring, offline-verifiable QR and a low-bandwidth/PWA mode for villages, SMS/USSD checks. |
| **3. Division** | Several districts | Integration with national ID and existing e-mutation and land portals through official agreements; witness co-signing of anchors by three offices. |
| **4. National** | All offices | Shared public anchor, independent verifier open to the public, scheduled digitization of old khatians and deeds with Bangla OCR plus human review. |

**Roadmap items designed but not yet built:** co-owner share ledger, inheritance (warish) mutation, survey lineage graph, offline map and boundary-overlap rule, offline-signed QR, Bangla OCR with human review, identity and power-of-attorney checks, land-tax check. Legal rules for shares, heirs and tax are demo rules and must be confirmed by a land-law expert before real use.

---

## 7. Data, privacy and AI-tool disclosure
- All data is synthetic and created by the team. No real names, NID numbers, phone numbers, addresses or land records are used. Nothing is scraped from any government portal and no live government system is tested.
- AI coding assistants were used during development. Every tool and what it did is listed in the README. Both student members can explain the code and design.

---

## 8. Team and mentor details
| Role | Name | DIU ID / Organization | Contact |
| :--- | :--- | :--- | :--- |
| **Student 1 (Team Leader)** | Mohammad Abrar Hasnat | DIU ID: 253-15-689 | [fill in] |
| **Student 2** | [fill in] | [fill in] | [fill in] |
| **Faculty mentor** | [fill in] | [fill in] | [fill in] |
| **Industry mentor** | [fill in] | [fill in] | [fill in] |

- **Team name:** [fill in]
- **Repository:** [GitHub/GitLab link]
- **Live link:** [Render link]
