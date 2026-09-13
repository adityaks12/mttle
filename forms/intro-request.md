# Intro request (customer capture)

Field bank lives in the operating workbook (kept offline, not in this repo), tab `Form_Customer_Request`. This file mirrors it. The browse page's "Request an intro" button messages your WhatsApp by default, which is the simplest month-one path. If you prefer a form, build this and point responses at `Customer_Master` and `Customer_Requests`.

Fields:
- Name (short text). Feeds Customer_Master.
- Phone or WhatsApp (phone). Feeds Customer_Master.
- Area or society (short text, prefer exact society). Feeds Customer_Master and Customer_Requests.
- What are you looking to achieve (checkboxes: general fitness, weight loss, strength, muscle gain, beginner fitness, women's fitness, PCOS-aware fitness). Feeds Customer_Requests Goal.
- Trainer gender preference (dropdown: female, male, no preference).
- Preferred days (checkboxes, Mon to Sun).
- Preferred time window (short text, e.g. "6 to 8 AM").
- Monthly budget (dropdown: under 8k, 8k to 12k, 12k to 18k, 18k+).
- Where do you want to train (dropdown: society gym, client gym, home, outdoor, online).
- Preferred session length (dropdown, optional: 45, 60, 75, 90 minutes).
- Anything important for your trainer (paragraph, optional, e.g. beginner-friendly, language, strength-focused). This is the client safety question when it covers medical conditions, pregnancy, or injuries. Pass it to the trainer.
- Any deal breakers (paragraph, optional).
- Consent to be contacted for trainer introductions (checkbox, required).

After capture: reply with a UPI QR or a Razorpay or Instamojo payment link. On payment, share the trainer's contact along with the safety note, and log the row in `Introductions` and `Payments`. Log the inquiry's outcome so `Acquisition_Experiments` and the price test (see `docs/DECISIONS.md`) stay current.

Note: the page never reveals the trainer's number. You share it manually after payment.
