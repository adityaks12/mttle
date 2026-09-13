# Spec, data model and page behaviour

## Reference workbook, the operating backend
The operating backend is a live Google Sheet: a multi-tab workbook covering trainer profiles, availability, documents, reviews, societies, customers, requests, introductions, payments, followups, form question banks, controlled lists, an onboarding checklist and acquisition experiments. This is the source of truth for how the concierge operation runs, and it is edited in a browser at its own Google Sheets URL, never as a local file.

The operating workbook is kept entirely offline: on the founder's own computer, and in Google Sheets. It is never copied into this repo, in any form, not even as a snapshot. This document describes its schema from memory so the code and the process stay understandable together, but if the live sheet's schema changes, this description can go stale, there is no file here that would ever be regenerated to catch it up.

`Trainer_Master` itself is never published to the web and never shared beyond you. It holds phone numbers, full legal names, consent flags and internal notes. "Publish to web" has no per-column redaction, so publishing `Trainer_Master` directly would ship every private field to anyone who finds the CSV URL, and that URL sits in plain text in `site/index.html`'s source on the live site. It is also a poor idea to publish any tab from the same file `Trainer_Master` lives in at all, one wrong sharing setting on that file would then risk the whole business workbook, not just one tab. Instead, the browse page reads from a second, entirely separate Google Sheets file, with no formula link and no shared ownership between the two.

## The public feed, a completely separate file
A brand-new Google Sheet, for example named "Spot — Public Trainer Feed," containing nothing but one tab with these headers in row 1:

`Trainer ID, Display Name, Status, Locality, Training Format, Current Open Slots, Specialisations, Price / Session, Typical Monthly Price, Certifications, Years Experience`

`Locality` is a broad area (e.g. "Koramangala" or "HSR Layout, Koramangala"), not a list of specific societies. A trainer is not restricted to named societies, she serves whatever falls within her locality, so the field only needs to tell a customer whether the trainer covers her general area, not enumerate every complex.

There is no formula connecting it to `Trainer_Master`, deliberately. You type a row into this file by hand for every trainer who should be visible on the browse page, copying across only these eleven fields. Nothing else about her ever goes in this file: no phone number, no full name, no email, no ID status, no internal notes, because those columns do not exist in this file at all, there is nothing to leak by construction.

This file, and only this file, ever gets **File, Share, Publish to web** run on it. Its CSV URL is what goes into `site/index.html`'s CONFIG.sheetCsvUrl. `Trainer_Master`'s own file is never published, never gets a public link, full stop.

Public, rendered on the page: Display Name, Locality, Training Format, Certifications, Specialisations, Years Experience, Current Open Slots, Price / Session, Typical Monthly Price.

Never in the public feed, because the file has no columns for them: Full Name, Phone, Email, Gender, Languages, Session Length, Trial Offered, Profile Photo, Professional Profile Link, Bio, consent flags, contact dates, internal notes. These stay in `Trainer_Master` only, in a different file entirely.

Keeping it in sync is a manual step, deliberately, since there is no formula doing it for you:
- **Going active**: once a trainer passes onboarding and you set her Status to Active in `Trainer_Master`, also add or update her row in the public feed file with the current values of those eleven fields. Setting her Status in `Trainer_Master` alone does nothing to the public page, the two files do not talk to each other.
- **Going inactive**: to remove her from the page (Paused, Full, Rejected, or she has left), delete her row from the public feed file, or change its Status value to anything other than Active. Changing her Status in `Trainer_Master` alone is not enough.
- **Any update** (price, open slots, availability, locality), edit both files: the real record in `Trainer_Master`, and the mirrored fields in the public feed.

The page's own `showStatuses` check (below) still filters to Active as a second, defense-in-depth layer, in case a non-Active row is ever left in the public feed by mistake.

Multi-value cells (Locality, Specialisations) hold comma-separated values inside one cell. Google exports these as quoted CSV fields. The page has a CSV parser that handles quoted commas, so do not switch to a naive split on comma.

## The schedule feed, optional, a third separate file
A raw open-slots count does not tell a customer whether a trainer is free when she actually wants a session. A third Google Sheet, for example "Spot — Trainer Schedule," fixes that: one tab, headers in row 1:

`Trainer ID, Day, Start Time, End Time, Currently Open`

One row per trainer per recurring weekly slot (so a trainer with three weekly windows has three rows). `Day` is a full weekday name (Monday..Sunday). `Currently Open` is Yes or No, so a slot can be temporarily marked taken without deleting the row. No PII here either, `Trainer ID` is the only join key, matched against the public feed's `Trainer ID`.

Publish this tab the same way, CSV, and put its URL in `site/index.html`'s CONFIG.scheduleCsvUrl. This is additive, not required: a trainer with rows in this feed shows her actual open days and times on her card as a stacked list, one slot per line (e.g. "Mon 6:00 AM–8:00 AM" on its own line, "Wed 6:00 AM–8:00 AM" on the next), sorted Monday to Sunday then by start time and filtered to `Currently Open = Yes` only. The list scroll-caps at a few visible rows so a trainer with many slots does not stretch her card taller than everyone else's, the rest are still there on scroll. A trainer with no rows here falls back to the public feed's `Current Open Slots` number, so leaving CONFIG.scheduleCsvUrl blank, or a trainer having no schedule rows, degrades gracefully rather than breaking anything.

Keeping it in sync is the same manual discipline as the public feed: update this file's rows whenever a trainer's actual availability changes, there is no formula linking it to anything either.

## Browse page (`site/index.html`)
A single self-contained file. The config block sits at the top of the script:
- brandName, headline, tagline
- sheetCsvUrl: the published CSV URL for the separate public feed file, never anything from the `Trainer_Master` workbook. Blank shows an empty "no trainers listed yet" state, there is no placeholder data anywhere in this file.
- scheduleCsvUrl: the published CSV URL for the separate schedule feed file, optional. Blank, or a fetch failure, just means every card falls back to the open-slots count, it never blocks or breaks the main trainer list.
- whatsappNumber: the founder's business number in international format. The intro button messages this number.
- showStatuses: ["Active"]
- columns: a map from field to the exact public feed header. Matching is trimmed and case-insensitive.
- scheduleColumns: same idea, for the schedule feed's headers.

Behaviour:
- Fetch both CSVs in parallel. The schedule fetch is wrapped so its failure never surfaces as an error or blocks the trainer list, since it is a nice-to-have.
- Parse each, map by header name, keep only showStatuses rows from the public feed, and expose only public fields.
- Build a trainer-ID keyed schedule map from the schedule feed, `Currently Open = Yes` rows only, sorted Monday to Sunday then by start time.
- Filters: society (a dropdown built from the data) and focus or specialization (chips built from the data).
- Card: first-name avatar, name, years, specialization tags, trains-at, training format, actual available days/times if the schedule feed has rows for her, else the open-slots count, certified, price, and a "Request an intro" button.
- The intro button opens wa.me to whatsappNumber with the trainer's display name and ID prefilled. It never contains the trainer's number.
- States: loading, empty with no sheet configured ("no trainers listed yet"), empty because the feed genuinely has zero Active rows (same message), empty because filters matched nothing (a different, filter-specific message), and error on the main feed (a note, then the same empty state, never placeholder data). The schedule feed has no error state of its own, it just silently falls back per trainer.

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
