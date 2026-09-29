# Deploy and manual setup

## Host the page
The repo stays private, and only `site/` is ever allowed to reach a public host. `docs/` and `forms/` hold the business plan and must never sit in a hosting publish directory, even on a private repo, because the deployed site itself is public. The operating workbook and full trainer roster are not in this repo at all, they stay offline.

Netlify (what this project actually uses): site `mttle-trainer-intro`, live at mttle-trainer-intro.netlify.app.

This site is not linked to the GitHub repo. It was created with a one-off CLI deploy, so a `git push` alone never updates the live page, it only updates GitHub. To publish any change to `site/index.html`, commit and push as usual, then also run:

```
netlify deploy --prod --dir=site --site=f4f5fc8e-b48a-4656-94b2-38cf355f4fa2
```

from the repo root. This was a deliberate choice over linking GitHub for auto-deploy (simpler for a one-person, low-frequency-push project, no dashboard hookup to maintain), but it means every deploy is a manual step, do not assume a push alone went live. Always verify with a cache-busted fetch after deploying:

```
curl -s "https://mttle-trainer-intro.netlify.app/?nocache=$(date +%s)" | grep -o "some-string-unique-to-your-change"
```

Option B, Cloudflare Pages: same idea, set the build output directory to `site`.

GitHub Pages is not a good fit here: its subfolder option is fixed to `/docs`, which this repo already uses for the private project docs, so there is no clean way to publish only `site/`.

Custom domain: point mttle.in at the host when you are ready (Netlify domain settings, or your registrar's DNS).

## Go-live checklist
1. Create a brand-new, separate Google Sheet, for example "mttle — Public Trainer Feed." One tab, headers in row 1: `Trainer ID, Display Name, Status, Locality, Training Format, Current Open Slots, Specialisations, Price / Session, Typical Monthly Price, Certifications, Years Experience, Photo 1 URL, Photo 2 URL`. Locality is a broad area, not a list of named societies a trainer is restricted to. Photo columns are optional. No formula, no connection to the operating workbook, see `docs/SPEC.md`.
2. Publish that new file's tab to the web: File, Share, Publish to web, CSV, Publish. Copy the URL. Never publish anything from the operating workbook itself, that is where `Trainer_Master` and every other private tab lives.
3. In `site/index.html`, set CONFIG.sheetCsvUrl to that URL and CONFIG.whatsappNumber to your business number.
4. Optional: create a third Google Sheet for reviews (`Trainer ID, Reviewer First Name, Rating, Testimonial, Date`), publish it, and set CONFIG.reviewsCsvUrl. See `docs/SPEC.md`.
5. Build the two forms from `forms/` in Google Forms, either by hand or by running `forms/create-forms.gs` once in the Apps Script editor (script.google.com), which generates both from the same specs. Point responses at their own Form Responses tab, then transfer to `Trainer_Master` by hand after screening, see `docs/SPEC.md`.
6. Create an access-restricted Google Drive folder for IDs and certificates, linked from Trainer_Documents. Do not store these in the open sheet.
7. Commit and push, then run the manual `netlify deploy --prod` command above (see "Host the page," pushing alone does not update the live site). Confirm the live URL shows your trainers rather than the empty state, and that visiting `/docs/` on the live URL 404s.
8. From here on, every time a trainer goes Active, Paused or changes a public-facing detail, update her row in the public feed sheet by hand, in addition to `Trainer_Master`. The two files are not linked, see `docs/SPEC.md`'s "Keeping it in sync" note.

## Not now
Google API automation (Sheets, Drive or Forms via credentials, or an Apps Script) is a later phase. At this stage everything Google is manual, and that is correct.
