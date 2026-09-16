# Customer request form ("Spot Customer Details")

This describes the actual live Google Form, linked directly to the operating workbook (kept offline, not in this repo). The browse page's "Request an intro" button messaging WhatsApp is still the primary month-one path, this form is the alternative for anyone who'd rather fill a form. `forms/create-forms.gs` generates this exact structure from scratch if you ever need to recreate it.

Single page, no sections. Collects a verified email (respondent must sign in) via the form's own Settings, not a listed question below. Note this means an anonymous customer cannot submit without a Google account, worth knowing since it adds friction a WhatsApp message doesn't have.

1. Customer Phone (short text, required)
2. Customer First Name (short text, required)
3. Customer Last Name (short text, required)
4. Customer Gender (multiple choice: Male, Female, Other, optional)
5. Address/Society (short text, required)
6. Area (short text, required)
7. Goals (short text, required) — free text, not a checklist
8. Trainer gender preference (multiple choice: Male, Female, Other, required)
9. Preferred days (checkboxes, Monday to Sunday, required)
10. Preferred time window (checkboxes: Morning, Evening, optional)
11. Monthly budget (short text, optional) — free text, not a dropdown band
12. Anything important for your trainer? Any deal breakers? (paragraph, optional) — this is the client safety question when it covers medical conditions, pregnancy, or injuries, pass it to the trainer
13. Consent to be contacted for trainer introductions (multiple choice: Yes, No, required)

After capture: reply with a UPI QR or a Razorpay or Instamojo payment link. On payment, share the trainer's contact along with the safety note, and log the row in `Introductions` and `Payments`. Log the inquiry's outcome so `Acquisition_Experiments` and the price test (see `docs/DECISIONS.md`) stay current.

Note: the browse page never reveals the trainer's number. You share it manually after payment.
