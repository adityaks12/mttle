# mttle, project guide for Claude Code

mttle is a hyperlocal introduction and matching service that connects people with the personal trainers who actually fit their needs. Today's wedge is women in Bangalore apartment societies (Koramangala and HSR Layout) finding vetted female fitness trainers who train them at their own society (clubhouse) gym; the same model extends to men and to well-qualified male trainers over time, see `docs/PLAYBOOK-PLATFORM.md`'s Expansion section, this is a sequencing choice, not the product's permanent scope. Browsing is free. The customer pays a fee to unlock a chosen trainer's direct contact and arranges sessions directly. Domain: mttle.in.

Before making changes, read the two local playbooks: `docs/PLAYBOOK-PLATFORM.md` (the idea, target, categories, monetization, pricing, settled decisions, do not relitigate) and `docs/PLAYBOOK-DEPLOYMENT.md` (data model, page behaviour, git workflow, deploy steps). Both are gitignored, local only, and never committed. If either is missing, ask the founder for it, don't reconstruct it from guesses or from what's left in this file.

## Current stage
Pre-launch demand test, run concierge. No automation. Google Forms, Sheets and Drive are the manual backend. The only code artifact is the browse page (`site/index.html`). The goal of this stage is to find out whether a woman will pay before receiving a trainer's contact.

## Stack
- Static site, single file: `site/index.html` (vanilla HTML, CSS and JS, no build step). `site/` is the only folder ever published; `docs/`, `forms/` and `data/` never get deployed and must stay out of any hosting publish directory.
- Data source: up to three completely separate Google Sheets, none with a formula link to the operating workbook (which holds `Trainer_Master` and everything else, kept live as a Google Sheet, and kept entirely offline, not in this repo in any form). The public feed (required) is hand-maintained with only public-safe columns for Active trainers. The schedule and reviews feeds (both optional) add real time slots and testimonials. All published to the web as CSV. Never publish anything from the operating workbook itself, it holds phone numbers, full names and internal notes. See `docs/PLAYBOOK-DEPLOYMENT.md`.
- Trainer profile page: not a separate HTML file, a client-side detail view toggled by a `#trainer=ID` URL hash within the same `site/index.html`, since trainer data is dynamic from a sheet and there is no build step to generate one page per trainer.
- Hosting: Netlify site `mttle-trainer-intro`, publish directory `site` (see `netlify.toml`). Not linked to GitHub, deploy is a manual `netlify deploy --prod --dir=site --site=f4f5fc8e-b48a-4656-94b2-38cf355f4fa2` after every push, see `docs/PLAYBOOK-DEPLOYMENT.md`. A `git push` alone does not update the live site, always deploy and then verify with a cache-busted fetch. GitHub Pages is not used here since its subfolder option is fixed to `/docs`, which this repo already uses for local project docs.
- Fonts load from Google Fonts. No other dependencies.

## Hard rules, do not break
- Never expose a trainer's phone number, full name, or ID document in any client-side file, in the page, or in its source. Public data is display name only, plus specialization, locality, training format, certifications, years, price, up to two already-watermarked photos, and either an open-slots count or actual available days/times if the optional schedule feed has rows for her (see `docs/PLAYBOOK-DEPLOYMENT.md`).
- The "Request an intro" button messages the founder's WhatsApp (CONFIG.whatsappNumber), never the trainer. The founder confirms payment before any contact is shared.
- A trainer appears on the page only when her Status is Active.
- Favourites are saved to the browser's local storage only. No login, no server, no per-user data collection anywhere in this file. If a login system is ever added, that is a strategic decision, raise it in chat first, do not add it quietly.
- Reviews only ever render on a trainer's profile page, never on the card.
- Categories in scope: general women's fitness and PCOS-friendly training only. Do not add prenatal, postnatal, rehab or post-injury content or fields (deferred for clinical-risk reasons). Refer to PCOS as "experienced with PCOS-friendly training," never as treating or managing a condition.
- Keep a plain disclaimer on the page: an introduction service, not a medical provider.
- Writing style everywhere (page copy, docs, commit messages): no em dashes or en dashes, use commas, periods or parentheses. Sentence case. Plain, active voice.

## Brand
- Colour: Kelly green. Tokens live in the `:root` block of `site/index.html`.
  - --signal #22C55E (bright accents, active chips)
  - --signal-deep #15803D (buttons, coloured text on light backgrounds, keep for contrast)
  - --signal-tint #DAF5E3 (tag and pill backgrounds)
  - --paper #F4F2EC, --ink #17150F, --muted #6E685C, --line #E4E0D5
- Type: Bricolage Grotesque (display and wordmark), Hanken Grotesk (text).
- Wordmark: "mttle", lowercase, no punctuation, no logo mark. Taglines: "find your trainer" and "the right trainer, nearby."
- To change colourway, edit only the three --signal values. Alternates are noted in `site/index.html`.

## Key files
- `site/index.html`, the browse page, and the only file ever published. The config block sits at the top of the script (brand, sheet URL, WhatsApp number, column map, publish statuses).
- The operating workbook itself (trainer, society, customer, request, introduction, payment and followup tracking, plus form question banks and controlled lists) is not in this repo at all, it stays offline on the founder's own computer and in Google Sheets. `docs/PLAYBOOK-DEPLOYMENT.md` describes every tab from memory, and the separate public feed sheet that the browse page actually reads.
- `docs/` is entirely gitignored, local only, never committed: `PLAYBOOK-PLATFORM.md`, `PLAYBOOK-DEPLOYMENT.md`, and `BACKLOG.md` (a running to-do list). Nothing under `docs/` is ever in git, don't assume a fresh clone has it.
- `forms/`, specs for the two Google Forms (mirrors the workbook's Form_Trainer_Intake and Form_Customer_Request tabs), plus `create-forms.gs`, an Apps Script that generates both forms from those specs in one run instead of building them by hand. One-off scaffolding, not the ongoing automation `docs/PLAYBOOK-PLATFORM.md`'s settled decision 12 rules out.
- `data/sample-trainers.csv`, a reference of the expected public feed sheet shape (fictional data, matches CONFIG.columns).

## Git workflow
- Never commit directly to `main`. Create a branch for any local change first (`git checkout -b <name>`), commit there.
- When ready to ship, merge it into `main` (`git checkout main && git merge <name>`) and push. No PR needed, this is a solo repo.
- History rewrites (`filter-branch`, force-pushing over existing commits) are a separate, higher-stakes thing from normal branching and merging: always get the founder's explicit permission first, every time, regardless of the branch workflow above.

## Run and deploy
- Preview: open `site/index.html` in a browser. With no sheet URL set, it shows an empty "no trainers listed yet" state, never placeholder data.
- Go live: create the separate public feed sheet (see `docs/PLAYBOOK-DEPLOYMENT.md`), publish it as CSV, paste the URL into CONFIG.sheetCsvUrl, set CONFIG.whatsappNumber, merge to `main`, push, then run the manual Netlify deploy (see Stack above and `docs/PLAYBOOK-DEPLOYMENT.md`), pushing alone does not go live. The schedule and reviews feeds (CONFIG.scheduleCsvUrl, CONFIG.reviewsCsvUrl) are optional, add them any time.
- Ongoing: the public feed sheet has no formula link to `Trainer_Master`, so every trainer change (going Active, Paused, a price or slot update) needs a matching hand edit in both files. See `docs/PLAYBOOK-DEPLOYMENT.md`'s "Keeping it in sync" note.

## How to work here
Strategy, pricing, category and go-to-market decisions are made in chat and recorded in `docs/PLAYBOOK-PLATFORM.md`. Build against those. If a task seems to need a new strategic decision, ask rather than deciding it in code.
