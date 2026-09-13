# Deploy and manual setup

## Host the page
The repo stays private, and only `site/` is ever allowed to reach a public host. `docs/`, `reference/` and `forms/` hold the business plan and the full trainer roster and must never sit in a hosting publish directory, even on a private repo, because the deployed site itself is public.

Option A, Netlify (recommended, what this project uses):
1. Push this repo to GitHub (private is fine, Netlify reads private repos with its GitHub App).
2. On Netlify, choose New site from Git and pick the repo. Build command: none. Publish directory: `site` (already set in `netlify.toml`, do not change it to the repo root).
3. Every push to the main branch redeploys automatically.

Option B, Cloudflare Pages: same idea, set the build output directory to `site`.

GitHub Pages is not a good fit here: its subfolder option is fixed to `/docs`, which this repo already uses for the private project docs, so there is no clean way to publish only `site/`.

Custom domain: point spot.in at the host when you are ready (Netlify domain settings, or your registrar's DNS).

## Go-live checklist
1. In your live Google Sheet copy of the operating workbook, add a `Trainer_Public_View` tab with the QUERY formula from `docs/SPEC.md`. It pulls only public-safe columns and only Active rows from `Trainer_Master`.
2. Publish only `Trainer_Public_View` to the web: File, Share, Publish to web, choose the Trainer_Public_View tab, CSV, Publish. Copy the URL. Never publish `Trainer_Master` itself, it holds phone numbers, full names and internal notes.
3. In `site/index.html`, set CONFIG.sheetCsvUrl to that URL and CONFIG.whatsappNumber to your business number.
4. Recreate the two forms from `forms/` in Google Forms (mirrors Form_Trainer_Intake and Form_Customer_Request in the workbook). Point trainer intake responses at Trainer_Master (or copy them in). Point the intro request at Customer_Master and Customer_Requests.
5. Create an access-restricted Google Drive folder for IDs and certificates, linked from Trainer_Documents. Do not store these in the open sheet.
6. Commit and push. Confirm the live URL shows your trainers rather than the sample banner, and that visiting `/docs/` or `/reference/` on the live URL 404s.

## Not now
Google API automation (Sheets, Drive or Forms via credentials, or an Apps Script) is a later phase. At this stage everything Google is manual, and that is correct.
