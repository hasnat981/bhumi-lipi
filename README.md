# ভূমি লিপি · Bhumi Lipi
**Land papers. Now with proof.** A tamper-evident land deed registry for Bangladesh: every deed gets a digital seal, the same land cannot be sold twice, and anyone can check a plot or a deed in 10 seconds.

LandTech Innovation Hackathon 2026 · Track: Digital Land Records, Verification & Digitization
**Main problem: P2 (Deed & Ownership Verification)**, with the pieces that make it work end to end: P3 (fraud and double-sale detection), P4 (registration → e-mutation link) and P5 (citizen "check before you buy").

> **Demo data only.** Every name, plot and record is synthetic. No real names, NID numbers, phone numbers or land records. No scraping, no testing of any government system.

## The idea in one minute
Today registration (sub-registry) and mutation (AC Land) are separate paper steps in separate offices, and nobody can cheaply check a deed. Bhumi Lipi makes them **one sealed lifecycle**:

1. **Seal** – registering a deed creates a block: SHA-256 hash of all its fields, linked to the previous block of the plot, signed with the **office's own Ed25519 key**.
2. **Lock** – the plot locks automatically. A second sale is rejected until mutation is finished.
3. **Mutation** – e-mutation starts by itself, runs eight automatic checks, and an AC Land officer decides with one click. A rejected sale appends a `REVERSAL` block (history is never deleted).
4. **Check** – citizens, banks and courts see a Green / Amber / Red verdict in plain Bangla or English, scan the deed's QR, or drop the deed file to see if it was altered.
5. **Anchor** – a public Merkle root over all records means even an insider with a key cannot silently rewrite history. An independent script (`tools/verify_anchor.py`) re-checks everything without trusting our server.

## What is different from other countries' models
| Country | Idea | Gap | What we do |
|---|---|---|---|
| Georgia | Deeds on a public blockchain | Needs blockchain infrastructure, no fraud rules | Hash chain + office signatures + fraud rules + public anchor. No coin, no gas fee |
| India | Drone maps + GIS titles | Maps alone do not stop forged sales | One plot ID that deeds and CS/SA/RS/BS survey records attach to |
| Rwanda | Nationwide GIS demarcation | Overlaps found late | Survey-area mismatch flagged at registration time |
| Estonia | X-Road + digital ID, paperless | Needs national ID and big integration | Registry and AC Land in one lifecycle, role-based; works with demo IDs today |
| Zambia | Blockchain + mobile GPS | Low access in remote areas | Bangla, low-data, mobile-first check page |

## Features (all working, all tested)
| Feature | Problem | Where |
|---|---|---|
| Signed hash-chain registry, append-only DB triggers, fork guard | P2 | `bhumi/chain.py`, `bhumi/db.py` |
| Verify by QR / seal code / deed file / "try to cheat" editor | P2 | `/#/verify` |
| 11 fraud rules with bilingual reasons and an explainable 0–100 risk score | P3 | `bhumi/rules.py` |
| Plot lock until mutation; fake-seller, double-sale, lien and government-land blocks | P3 | `bhumi/service.py` |
| e-Mutation state machine, 8 auto-checks, tracking ID, officer queue, reversal blocks | P4 | `bhumi/mutation.py`, `/#/mutation` |
| Citizen verdict (Green/Amber/Red), history, survey lineage, print to PDF | P5 | `/#/check` |
| Bank liens and double-mortgage block | P3 | `/#/bank` |
| Public Merkle anchor, inclusion proof checked **in your browser**, independent verifier script | P2 | `/#/integrity`, `tools/verify_anchor.py` |
| Attack lab: 5 attacks on a private copy of the DB | all | `/#/lab` |
| **Simple mode for every age**: three-word shape verdicts, big text, high contrast, read-aloud (when a Bangla voice exists), ana-gonda calculator | P5 | `web/js/views/check.js`, `web/js/a11y.js` |
| Mutation aging chip (waiting N days) | P4 | `bhumi/mutation.py` |
| Bangla / English, dark mode, mobile first, keyboard friendly | UX | `web/` |

## Run it (2 commands)
```bash
pip install -r requirements.txt     # only dependency: cryptography
python server.py                    # http://127.0.0.1:8000  (seeds demo data on first run)
```
Try the demo story: open **Check**, click the sample plots; switch role (top right) to **Sub-registrar**, press **Fake seller** then **Register and seal**; switch to **AC Land** and approve; open **Attack lab**.

For the file-drop demo: `python tools/make_demo_files.py` writes `demo_files/genuine_deed.txt` (GENUINE) and `tampered_deed.txt` (FORGED).

## Tests
```bash
python -m unittest discover -s tests -t . -v        # 53 tests: crypto, rules, lifecycle, aging, tamper detection, HTTP, verifier script, share maths
pip install -r requirements-dev.txt && playwright install chromium
python server.py &  BASE=http://127.0.0.1:8000 python tests/e2e_playwright.py   # real-browser walkthrough
```
The browser test also decodes the QR code shown on screen and checks that it opens the seal page.

## Deploy
* **Render (free):** push to GitHub → New Blueprint → select the repo (`render.yaml` is included). The demo database rebuilds from seed data on every start.
* **Docker:** `docker build -t bhumi-lipi . && docker run -p 8000:8000 bhumi-lipi`
* Environment: `BHUMI_MASTER_B64` (signing master secret), `BHUMI_DB` (database path), `PORT`, `BHUMI_STRICT=1` (refuse to start if keys changed instead of rebuilding the demo DB).

## Architecture
```
Browser (vanilla JS, no build step)  ──HTTPS JSON──▶  Python standard-library HTTP server
  Check · Verify · Registrar · Mutation · Bank              api.py   router, roles, rate limit, CSP
  Integrity · Lab · About                                   service.py  use cases
                                                            ├ chain.py     SHA-256, Ed25519 keyring, Merkle proofs
                                                            ├ rules.py     fraud rules, risk score
                                                            ├ mutation.py  state machine, auto-checks
                                                            └ db.py        SQLite + append-only triggers
```
Why the standard library and one dependency? A small, auditable attack surface that two students can fully explain. The service layer is framework-free, so moving to FastAPI + PostgreSQL later does not change the logic.

## API (all under `/api`)
`GET /plots`, `GET /plots/{id}`, `POST /risk`, `POST /deeds`, `GET /deeds/{hash}` and `/document`, `POST /verify`, `GET /mutations/queue`, `GET /mutations/{tracking}`, `POST /mutations/{tracking}/decision`, `GET|POST /liens`, `POST /liens/{id}/release`, `GET /integrity`, `GET /anchor`, `GET /anchor/proof/{hash}`, `GET /export`, `GET /keys`, `GET /alerts`, `POST /lab/run`, `GET /stats`, `GET /health`.
Demo roles via header `X-Demo-Role: citizen | registrar | ac_land | bank` (**not real authentication**: production would use national digital ID and hardware-held office keys).
Errors always carry `bn` and `en` messages.

## Security notes (full table: `docs/THREAT_MODEL.md`)
Strict Content-Security-Policy, input validation, 64 KB body limit, per-client rate limiting, path-traversal-safe static server, DB-level append-only rules, per-office signing keys, hashed IPs in the audit log, no secrets in the repo. **Honest limit:** a single-operator chain is tamper-*evident*, not tamper-proof. We detect rewrites with the public anchor and an independent verifier; production adds hardware keys and multi-office witness nodes.

## AI tools used (as required by the rules)
**Claude (Anthropic)** and **Google Antigravity (Gemini 3.8 Flash)** were used as AI coding agent assistants. Claude helped draft the initial foundation, tests, and documentation. Antigravity was used to implement Phase A frontend engineering: the SVG Seal component with state variants, the verdict reveal animation choreography, the chain crack view with broken link detection, the character-level diff and hash avalanche comparison in Verify, and the mobile bottom tab bar. Both student members reviewed, verified, ran and tested every module and can explain all code (see `docs/QA.md`). Open-source dependency: `cryptography` (Apache-2.0/BSD).

## Final blueprint (Bangladesh problems, international tech, Antigravity prompts)
`docs/V2_FINAL_BLUEPRINT.md`: what else the sealed lifecycle can solve, how to extend it without rewriting, and copy-paste prompts.

## Website plan
The full premium frontend plan (pages, design system, motion, copy deck, accessibility, build order): `docs/WEBSITE_PLAN.md`.

## Working with AI agents
Build it in one go with an agent: `docs/MASTER_PROMPT.md`. Build it yourself prompt by prompt: `docs/PROMPT_PLAYBOOK.md` (specs: `docs/SPEC.md`, `docs/UI_SPEC.md`). See `docs/ANTIGRAVITY_GUIDE.md` (works for Antigravity, Claude Code and Codex), `AGENTS.md`, `GEMINI.md`, `.agent/` workflows and `docs/SPEC.md`.

## Changes since Round 1
_(fill in before the Final Round)_

## Team
Student members, faculty mentor and industry mentor: _(fill in)_ · License: MIT
