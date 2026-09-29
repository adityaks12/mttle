# Trainer intake form ("mttle Trainer Details")

This describes the actual live Google Form, linked directly to the operating workbook (kept offline, not in this repo). Any submission lands straight in the sheet, no manual transfer needed for what the form itself captures. Onboarding is still call-based: fill it live on the call, or send the link to the trainer beforehand, either works. `forms/create-forms.gs` generates this exact structure from scratch if you ever need to recreate it.

Single page, no sections. Collects a verified email (respondent must sign in) via the form's own Settings, not a listed question below.

1. Trainer First Name (short text, required)
2. Trainer Last Name (short text, required)
3. Trainer Phone / WhatsApp (short text, required)
4. Trainer Gender (multiple choice: Female, Male, Other, required)
5. Address (short text, required)
6. Area (short text, required)
7. Email (short text, email format, optional)
8. Years of PT experience (short text, number, required)
9. Training Goals Supported/ Specialization (checkboxes: General fitness, Weight loss & Mobility, Strength/Muscle gain, PCOS-aware fitness, Physiotherpy, Corrective exercise specialist, Other, optional)
10. Previous gyms / employers (short text, optional)
11. Session length (short text, optional)
12. Price per session (short text, number, required)
13. Typical monthly package price (short text, number, required)
14. Currently accepting new clients? (multiple choice: Yes, No, required)
15. Number of currently open slots (short text, number, required)
16. Days available (checkboxes, Monday to Sunday, required)
17. Available time window (checkboxes: Morning, Evening, optional)
18. Possible slots marked in sheet (multiple choice, single option "Yes", required) — a self-confirmation that the availability above is actually reflected in the sheet, not a question to the trainer
19. Trial session offered? (multiple choice: Yes, No, required)
20. Languages spoken (short text, optional)
21. Certifications (short text, required)
22. Prior client testimonials? Name and number marked in sheet (multiple choice, single option "Yes", required) — same self-confirmation pattern as item 18
23. Identity document type (multiple choice: Aadhar, Pan, Driving License, Other, required) — the type only, the document itself is not uploaded through the form, see below
24. Anything important for your customers? Any deal breakers? (paragraph, optional)
25. Consent to list profile (multiple choice: Yes, No, required)
26. Consent to display photo (multiple choice: Yes, No, required)
27. Consent to share contact after paid introduction (multiple choice: Yes, No, required)

## What the form deliberately does not collect
- **Profile photo, ID document itself.** No file-upload questions. Photos and ID documents are collected and handled entirely outside the form (uploaded directly to the restricted Drive folder), not attached to a form response. Item 23 above records only which type of ID she has, not the file.
- **Locality as a checklist, maximum travel distance.** Replaced by the single Area free-text field (item 6). Simpler, and matches the "locality, not a restrictive list of named societies" stance in the local platform playbook.
