# Deploy and manual setup

## Host the page
Option A, Netlify (recommended for clean previews):
1. Push this repo to GitHub.
2. On Netlify, choose New site from Git and pick the repo. Build command: none. Publish directory: the repo root.
3. Every push to the main branch redeploys automatically.

Option B, GitHub Pages: in the repo Settings, Pages, deploy from the main branch root. Free, no previews.

Option C, Cloudflare Pages: similar to Netlify.

Custom domain: point spot.in at the host when you are ready (Netlify domain settings, or your registrar's DNS).

## Go-live checklist
1. Make `reference/PT_Marketplace_Operating_Repository.xlsx` your live copy in Google Sheets (upload it or recreate the tabs there), then: File, Share, Publish to web, choose the Trainer_Master tab, CSV, Publish. Copy the URL.
2. In `index.html`, set CONFIG.sheetCsvUrl to that URL and CONFIG.whatsappNumber to your business number.
3. Recreate the two forms from `forms/` in Google Forms (mirrors Form_Trainer_Intake and Form_Customer_Request in the workbook). Point trainer intake responses at Trainer_Master (or copy them in). Point the intro request at Customer_Master and Customer_Requests.
4. Create an access-restricted Google Drive folder for IDs and certificates, linked from Trainer_Documents. Do not store these in the open sheet.
5. Commit and push. Confirm the live URL shows your trainers rather than the sample banner.

## Not now
Google API automation (Sheets, Drive or Forms via credentials, or an Apps Script) is a later phase. At this stage everything Google is manual, and that is correct.
