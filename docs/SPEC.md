# Spec, data model and page behaviour

## Reference workbook, the operating backend
`reference/PT_Marketplace_Operating_Repository.xlsx` is the full manual operating backend: a multi-tab Google Sheet covering trainer profiles, availability, documents, reviews, societies, customers, requests, introductions, payments, followups, form question banks, controlled lists, an onboarding checklist and acquisition experiments. This is the source of truth for how the concierge operation runs.

`Trainer_Master` itself is never published to the web and never shared beyond you. It holds phone numbers, full legal names, consent flags and internal notes. "Publish to web" has no per-column redaction, so publishing `Trainer_Master` directly would ship every private field to anyone who finds the CSV URL, and that URL sits in plain text in `index.html`'s source on the live site. Instead, the browse page reads a second, derived tab: `Trainer_Public_View`.

## Trainer_Public_View, the tab you actually publish
A tab built with one formula, so it can never drift out of sync with `Trainer_Master` by hand:

```
=QUERY(Trainer_Master!A:AB, "select A, B, Y, H, I, S, L, O, P, K, J where Y = 'Active'", 1)
```

Put this in cell A1. It pulls exactly these columns, header row included, and only rows where Status is Active: Trainer ID, Display Name, Status, Societies Served, Training Format, Current Open Slots, Specialisations, Price / Session, Typical Monthly Price, Certifications, Years Experience. Nothing else, so there is no phone number, full name, email, consent flag or internal note in this tab to leak in the first place. This is what you publish to web as CSV (see `docs/DEPLOY.md`), and its URL is what goes in `index.html`'s CONFIG.sheetCsvUrl.

If `Trainer_Master`'s column order ever changes, update the letters in the QUERY string to match, and check the header text against `index.html`'s CONFIG.columns.

Public, rendered on the page: Display Name, Societies Served, Training Format, Certifications, Specialisations, Years Experience, Current Open Slots, Price / Session, Typical Monthly Price.

Never in `Trainer_Public_View` and never shipped client-side: Full Name (Internal), Phone (Internal), Email, Gender, Primary Area, Languages, Session Length, Trial Offered, Accepting New Clients, Profile Photo, Professional Profile Link, Bio, Consent to List, Consent to Share Contact, Last Contacted, Last Availability Confirmed, Internal Notes. These stay in `Trainer_Master` only.

Publish rule: the QUERY's `where Y = 'Active'` filter does the real work, so only Active rows ever leave `Trainer_Master`. The page's own `showStatuses` check is a second, defense-in-depth filter on top, not the only one. The controlled list for Status (see the `Lists` tab) is Lead, Contacted, Onboarding, Active, Paused, Full, Rejected, Inactive. If you want fully-booked trainers to stay visible with a "fully booked" note instead of disappearing, that is a product decision, raise it in chat first.

Multi-value cells (Societies Served, Specialisations) hold comma-separated values inside one cell. Google exports these as quoted CSV fields. The page has a CSV parser that handles quoted commas, so do not switch to a naive split on comma.

## Browse page (`index.html`)
A single self-contained file. The config block sits at the top of the script:
- brandName, headline, tagline
- sheetCsvUrl: the published CSV URL for the `Trainer_Public_View` tab, never `Trainer_Master`. Blank shows the built-in sample roster.
- whatsappNumber: the founder's business number in international format. The intro button messages this number.
- showStatuses: ["Active"]
- columns: a map from field to the exact Trainer_Public_View header. Matching is trimmed and case-insensitive.

Behaviour:
- Fetch the CSV, parse it, map by header name, keep only showStatuses rows, and expose only public fields.
- Filters: society (a dropdown built from the data) and focus or specialization (chips built from the data).
- Card: first-name avatar, name, years, specialization tags, trains-at, training format, open slots, certified, price, and a "Request an intro" button.
- The intro button opens wa.me to whatsappNumber with the trainer's display name and ID prefilled. It never contains the trainer's number.
- States: loading, empty (friendly and actionable), error (falls back to sample data with a note), and sample or preview (a banner when no sheet URL is set).

## The rest of the workbook
- `Trainer_Availability`, `Trainer_Documents`, `Trainer_Reviews`: kept separate from `Trainer_Master` so profile edits do not disturb scheduling, compliance or credibility records. The browse page does not read these; they are internal.
- `Society_Master`: the demand-side pipeline of target communities, kept manually.
- `Customer_Master`, `Customer_Requests`, `Introductions`, `Payments`, `Followups`: the customer CRM and the core marketplace funnel. `Introductions` is the transaction ledger; `Payments` tracks money; `Followups` closes the loop and is what tells you whether the service actually works.
- `Form_Trainer_Intake`, `Form_Customer_Request`: the question banks for the two Google Forms, see `forms/`.
- `Lists`: controlled vocabulary. Edit only when intentionally changing the operating process.
- `Trainer_Onboarding_Log`: the operational checklist per trainer.
- `Acquisition_Experiments`: every society, channel and price experiment, and what it converted. This is where the price test (see `docs/DECISIONS.md`) gets logged.

## Intro request and payment
Month-one path: the intro button opens the founder's WhatsApp. The founder replies with a UPI QR or a Razorpay or Instamojo payment link, confirms payment, logs it in `Payments` and the row in `Introductions`, then shares the contact along with the client safety question. A Google Form capture is an alternative to WhatsApp, see `forms/intro-request.md`.
