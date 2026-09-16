# Trainer intake form (build in Google Forms)

Field bank lives in the operating workbook (kept offline, not in this repo), tab `Form_Trainer_Intake`. This file mirrors it. Onboarding is call-based, so you can also read these off during the call and fill `Trainer_Master` directly. Group and order as below. "Customer facing" marks fields that end up visible on the browse page; everything else stays internal.

To build this as an actual Google Form without clicking through every field by hand, run `forms/create-forms.gs` in the Apps Script editor (script.google.com). One-off scaffolding, not automation, see the file's own header comment for exact steps.

## Identity
- Full name (short text). Internal only, feeds Full Name (Internal).
- Preferred display name (short text). Customer facing, this is what the page shows.
- Phone number (phone). Internal only.
- Email (email, optional). Internal only.
- Profile photo (file upload, clear headshot preferred). Customer facing only if you decide to show photos; treat as internal until then.

## Professional
- Years of personal training experience (number). Customer facing.
- Certifications (paragraph, list certification names). Customer facing. Request certificate upload separately, store in the restricted Drive folder.
- Previous gyms or employers (paragraph, optional). Internal.
- Languages spoken (checkboxes: English, Hindi, Kannada, Tamil, Telugu, Other). Customer facing.

## Specialisation
- Primary training goals supported (checkboxes: general fitness, weight loss, strength, muscle gain, beginner fitness, women's fitness, mobility, functional fitness, PCOS-aware fitness). Customer facing. Avoid medical claims. No prenatal or postnatal (deferred, see `docs/PROJECT.md`).

## Service
- Training format (checkboxes: society gym, client gym, home, outdoor, online). Customer facing.
- Locality served (checkboxes plus paragraph, broad areas like Koramangala or HSR Layout, not a restrictive list of named societies, she is not limited to only those). Customer facing.
- Maximum travel distance (number, km). Internal, informs matching.
- Session length (dropdown: 45, 60, 75, 90 minutes). Customer facing.

## Commercial
- Price per session (number, INR). Customer facing.
- Typical monthly package price (number, INR). Customer facing.
- Trial session offered (yes/no). Customer facing.

## Availability
- Days available (checkboxes, Mon to Sun). Customer facing, feeds `Trainer_Availability`.
- Time windows (grid or paragraph, e.g. "6:00 to 10:00 AM"). Customer facing, feeds `Trainer_Availability`.
- Currently accepting new clients (yes/no). Customer facing.
- Number of currently open slots (number). Internal, feeds Current Open Slots.

## Credibility, do not block listing
- Prior client testimonials (paragraph, ask for 1 to 3). Customer facing if permission given, feeds `Trainer_Reviews`. Obtain display permission separately.
- References available (yes/no). Internal. Call one or two.

## Compliance
- Identity document (file upload, government ID or other accepted proof). Internal, restricted access, feeds `Trainer_Documents`.

## Consent
- Consent to list profile (checkbox, required). Internal, DPDP consent record, feeds Consent to List.
- Consent to display photo (checkbox). Internal.
- Consent to share contact after paid introduction (checkbox, required). Internal, feeds Consent to Share Contact.
