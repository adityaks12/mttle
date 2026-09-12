# Spec, data model and page behaviour

## Reference workbook, the operating backend
`reference/PT_Marketplace_Operating_Repository.xlsx` is the full manual operating backend: a multi-tab Google Sheet covering trainer profiles, availability, documents, reviews, societies, customers, requests, introductions, payments, followups, form question banks, controlled lists, an onboarding checklist and acquisition experiments. This is the source of truth for how the concierge operation runs. The browse page only ever reads one published tab from it, `Trainer_Master`.

## Trainer_Master, the tab the browse page reads
Publish this tab to the web as CSV (see `docs/DEPLOY.md`). Columns, in order:

Trainer ID, Display Name, Full Name (Internal), Phone (Internal), Email, Gender, Primary Area, Societies Served, Training Format, Years Experience, Certifications, Specialisations, Languages, Session Length (min), Price / Session, Typical Monthly Price, Trial Offered, Accepting New Clients, Current Open Slots, Profile Photo, Professional Profile Link, Bio, Consent to List, Consent to Share Contact, Status, Last Contacted, Last Availability Confirmed, Internal Notes.

Public, rendered on the page: Display Name, Primary Area, Societies Served, Training Format, Years Experience, Certifications, Specialisations, Languages, Session Length (min), Price / Session, Typical Monthly Price, Trial Offered, Current Open Slots, Bio.

Private, never rendered and never shipped client-side: Full Name (Internal), Phone (Internal), Email, Profile Photo (unless you deliberately choose to show it), Professional Profile Link (unless deliberately public), Consent to List, Consent to Share Contact, Last Contacted, Last Availability Confirmed, Internal Notes.

Publish rule: a row appears on the page only when Status is Active. The controlled list for Status (see the `Lists` tab) is Lead, Contacted, Onboarding, Active, Paused, Full, Rejected, Inactive. Everything except Active hides the card. If you want fully-booked trainers to stay visible with a "fully booked" note instead of disappearing, treat Full as a second show-status, but that is a product decision, raise it in chat first.

Multi-value cells (Societies Served, Specialisations, Languages) hold comma-separated values inside one cell. Google exports these as quoted CSV fields. The page has a CSV parser that handles quoted commas, so do not switch to a naive split on comma.

## Browse page (`index.html`)
A single self-contained file. The config block sits at the top of the script:
- brandName, headline, tagline
- sheetCsvUrl: the published CSV URL for the `Trainer_Master` tab. Blank shows the built-in sample roster.
- whatsappNumber: the founder's business number in international format. The intro button messages this number.
- showStatuses: ["Active"]
- columns: a map from field to the exact Trainer_Master header. Matching is trimmed and case-insensitive.

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
