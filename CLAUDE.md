# Spot, project guide for Claude Code

Spot is a hyperlocal introduction and matching service that connects people with the personal trainers who actually fit their needs. Today's wedge is women in Bangalore apartment societies (Koramangala and HSR Layout) finding vetted female fitness trainers who train them at their own society (clubhouse) gym; the same model extends to men and to well-qualified male trainers over time, see `docs/PROJECT.md`'s Expansion section, this is a sequencing choice, not the product's permanent scope. Browsing is free. The customer pays a fee to unlock a chosen trainer's direct contact and arranges sessions directly; a quick call with the customer to understand her needs is part of how she gets matched to the right trainer. Domain: spot.in.

Before making changes, read `docs/PROJECT.md` (the idea), `docs/DECISIONS.md` (settled calls, do not relitigate), and `docs/SPEC.md` (data model and page behaviour).

## Current stage
Pre-launch demand test, run concierge. No automation. Google Forms, Sheets and Drive are the manual backend. The only code artifact is the browse page (`site/index.html`). The goal of this stage is to find out whether a woman will pay before receiving a trainer's contact.

## Stack
- Static site, single file: `site/index.html` (vanilla HTML, CSS and JS, no build step). `site/` is the only folder ever published; `docs/`, `reference/`, `forms/` and `data/` never get deployed and must stay out of any hosting publish directory.
- Data source: a derived tab, `Trainer_Public_View`, in the operating workbook (kept live as a Google Sheet, snapshot in `reference/PT_Marketplace_Operating_Repository.xlsx`). It is a QUERY formula over `Trainer_Master` that keeps only public-safe columns and only Active rows, published to the web as CSV. Never publish `Trainer_Master` itself, it holds phone numbers, full names and internal notes. See `docs/SPEC.md`.
- Hosting: a GitHub repo connected to Netlify, publish directory `site` (see `netlify.toml`). Push to deploy. GitHub Pages is not used here since its subfolder option is fixed to `/docs`, which this repo already uses for project docs.
- Fonts load from Google Fonts. No other dependencies.

## Hard rules, do not break
- Never expose a trainer's phone number, full name, or ID document in any client-side file, in the page, or in its source. Public data is display name only, plus specialization, society, training format, certifications, years, open slots, and price.
- The "Request an intro" button messages the founder's WhatsApp (CONFIG.whatsappNumber), never the trainer. The founder confirms payment before any contact is shared.
- A trainer appears on the page only when her Status is Active.
- Categories in scope: general women's fitness and PCOS-friendly training only. Do not add prenatal, postnatal, rehab or post-injury content or fields (deferred for clinical-risk reasons). Refer to PCOS as "experienced with PCOS-friendly training," never as treating or managing a condition.
- Keep a plain disclaimer on the page: an introduction service, not a medical provider.
- Writing style everywhere (page copy, docs, commit messages): no em dashes or en dashes, use commas, periods or parentheses. Sentence case. Plain, active voice.

## Brand
- Colour: Kelly green. Tokens live in the `:root` block of `site/index.html`.
  - --signal #22C55E (bright accents, wordmark dot, active chips)
  - --signal-deep #15803D (buttons, coloured text on light backgrounds, keep for contrast)
  - --signal-tint #DAF5E3 (tag and pill backgrounds)
  - --paper #F4F2EC, --ink #17150F, --muted #6E685C, --line #E4E0D5
- Type: Bricolage Grotesque (display and wordmark), Hanken Grotesk (text).
- Wordmark: "Spot." with a green dot. The dot is a full stop, not a location pin. "Spot" is the gym act of assisting a lift (a trainer spots you) and a pun on spotting your trainer. Taglines: "your trainer, spotted" and "get spotted."
- To change colourway, edit only the three --signal values. Alternates are noted in `site/index.html`.

## Key files
- `site/index.html`, the browse page, and the only file ever published. The config block sits at the top of the script (brand, sheet URL, WhatsApp number, column map, publish statuses).
- `reference/PT_Marketplace_Operating_Repository.xlsx`, the full operating workbook: trainer, society, customer, request, introduction, payment and followup tracking, plus the form question banks and controlled lists. The single source of truth for how the concierge operation runs, and never published anywhere. `docs/SPEC.md` describes every tab, including the `Trainer_Public_View` QUERY formula.
- `docs/`, PROJECT, DECISIONS, SPEC, DEPLOY. Private, never published.
- `forms/`, specs to recreate the two Google Forms by hand (mirrors the workbook's Form_Trainer_Intake and Form_Customer_Request tabs).
- `data/sample-trainers.csv`, a reference of the expected Trainer_Master shape.

## Run and deploy
- Preview: open `site/index.html` in a browser. With no sheet URL set, it shows sample trainers.
- Go live: build `Trainer_Public_View` in the sheet (see `docs/SPEC.md`), publish that tab as CSV, paste the URL into CONFIG.sheetCsvUrl, set CONFIG.whatsappNumber, commit and push. Netlify redeploys from the `site` publish directory only.

## How to work here
Strategy, pricing, category and go-to-market decisions are made in chat and recorded in `docs/DECISIONS.md`. Build against those. If a task seems to need a new strategic decision, ask rather than deciding it in code.
