# Deploy and manual setup

## Host the page
The repo stays private, and only `site/` is ever allowed to reach a public host. `docs/` and `forms/` hold the business plan and must never sit in a hosting publish directory, even on a private repo, because the deployed site itself is public. The operating workbook and full trainer roster are not in this repo at all, they stay offline.

Option A, Netlify (recommended, what this project uses):
1. Push this repo to GitHub (private is fine, Netlify reads private repos with its GitHub App).
2. On Netlify, choose New site from Git and pick the repo. Build command: none. Publish directory: `site` (already set in `netlify.toml`, do not change it to the repo root).
3. Every push to the main branch redeploys automatically.

Option B, Cloudflare Pages: same idea, set the build output directory to `site`.

GitHub Pages is not a good fit here: its subfolder option is fixed to `/docs`, which this repo already uses for the private project docs, so there is no clean way to publish only `site/`.

Custom domain: point spot.in at the host when you are ready (Netlify domain settings, or your registrar's DNS).

## Go-live checklist
1. Create a brand-new, separate Google Sheet, for example "Spot — Public Trainer Feed." One tab, headers in row 1: `Trainer ID, Display Name, Status, Locality, Training Format, Current Open Slots, Specialisations, Price / Session, Typical Monthly Price, Certifications, Years Experience, Photo 1 URL, Photo 2 URL`. Locality is a broad area, not a list of named societies a trainer is restricted to. Photo columns are optional. No formula, no connection to the operating workbook, see `docs/SPEC.md`.
2. Publish that new file's tab to the web: File, Share, Publish to web, CSV, Publish. Copy the URL. Never publish anything from the operating workbook itself, that is where `Trainer_Master` and every other private tab lives.
3. In `site/index.html`, set CONFIG.sheetCsvUrl to that URL and CONFIG.whatsappNumber to your business number.
4. Optional: create a third Google Sheet for reviews (`Trainer ID, Reviewer First Name, Rating, Testimonial, Date`), publish it, and set CONFIG.reviewsCsvUrl. See `docs/SPEC.md`.
5. Recreate the two forms from `forms/` in Google Forms (mirrors Form_Trainer_Intake and Form_Customer_Request in the workbook). Point responses at their own Form Responses tab, then transfer to `Trainer_Master` by hand after screening, see `docs/SPEC.md`.
6. Create an access-restricted Google Drive folder for IDs and certificates, linked from Trainer_Documents. Do not store these in the open sheet.
7. Commit and push. Confirm the live URL shows your trainers rather than the empty state, and that visiting `/docs/` on the live URL 404s.
8. From here on, every time a trainer goes Active, Paused or changes a public-facing detail, update her row in the public feed sheet by hand, in addition to `Trainer_Master`. The two files are not linked, see `docs/SPEC.md`'s "Keeping it in sync" note.

## Not now
Google API automation (Sheets, Drive or Forms via credentials, or an Apps Script) is a later phase. At this stage everything Google is manual, and that is correct.
