/**
 * Creates the two Spot Google Forms (Trainer Intake, Customer Request) from
 * the field specs in forms/trainer-intake.md and forms/intro-request.md.
 *
 * This is a one-off scaffolding script, not the ongoing automation ruled out
 * by docs/DECISIONS.md item 12. Run it once to generate both forms instead
 * of clicking through ~25 fields by hand in the Google Forms UI. Everything
 * after that (reading responses, transferring into Trainer_Master, etc.)
 * stays exactly as manual as the docs already describe.
 *
 * HOW TO RUN
 * 1. Go to script.google.com, New project.
 * 2. Delete the placeholder code, paste this whole file in.
 * 3. Save (Ctrl/Cmd+S), name the project something like "Spot Form Builder".
 * 4. In the function dropdown at the top, select "createAllSpotForms", click Run.
 * 5. First run asks you to authorize the script (it needs permission to
 *    create files in your Drive, since a Form is a Drive file). Approve it.
 * 6. Open View > Logs (or Execution log) to get both forms' edit and live
 *    links. The edit link is what you open to review/tweak; the live link
 *    is what you'd actually send to a trainer or customer.
 * 7. Each form starts fully private, only you can see or edit it. Nothing
 *    is shared or published anywhere by this script.
 *
 * AFTER RUNNING
 * - Responses land in each form's own "Responses" tab. To route them to a
 *   spreadsheet instead (so you can review as rows), open the form, go to
 *   Responses > the green Sheets icon > Create a new spreadsheet or select
 *   existing. This is the "Form Responses" tab docs/DEPLOY.md refers to,
 *   you still transfer accepted trainers into Trainer_Master by hand.
 * - The trainer form has two file-upload questions (photo, ID document).
 *   Google requires a respondent to be signed in to a Google account to
 *   upload a file, this script turns on "Collect email addresses" on that
 *   form for exactly that reason. The customer form has no file uploads
 *   and is left open to anonymous responses.
 * - Re-running this script creates two brand-new forms each time, it does
 *   not edit existing ones. Delete the old ones from Drive if you re-run.
 */

function createAllSpotForms() {
  const trainerForm = createTrainerIntakeForm();
  const customerForm = createCustomerRequestForm();

  Logger.log("=== Trainer Intake form ===");
  Logger.log("Edit:  " + trainerForm.getEditUrl());
  Logger.log("Live:  " + trainerForm.getPublishedUrl());
  Logger.log("");
  Logger.log("=== Customer Request form ===");
  Logger.log("Edit:  " + customerForm.getEditUrl());
  Logger.log("Live:  " + customerForm.getPublishedUrl());
}

function createTrainerIntakeForm() {
  const form = FormApp.create("Spot — Trainer Intake");
  form.setDescription(
    "Thanks for your interest in training with Spot. This takes about 10 minutes. " +
    "If we're doing this on a call instead, read these off and fill the sheet directly, " +
    "you don't need the respondent to type anything herself."
  );
  form.setCollectEmail(true); // required for the file-upload questions below to work

  // ---------- Identity ----------
  form.addTextItem().setTitle("Full name").setRequired(true);

  form.addTextItem()
    .setTitle("Preferred display name")
    .setHelpText("This is the only name shown publicly on the browse page.")
    .setRequired(true);

  form.addTextItem().setTitle("Phone number").setRequired(true);

  form.addTextItem()
    .setTitle("Email")
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(false);

  form.addFileUploadItem()
    .setTitle("Profile photo")
    .setHelpText("A clear headshot. You'll watermark this yourself before it ever goes public.")
    .setRequired(false);

  // ---------- Professional ----------
  form.addPageBreakItem().setTitle("Professional");

  form.addTextItem()
    .setTitle("Years of personal training experience")
    .setValidation(FormApp.createTextValidation().requireWholeNumber().build())
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Certifications")
    .setHelpText("List certification names. We'll ask for the certificate itself separately.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Previous gyms or employers")
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle("Languages spoken")
    .setChoiceValues(["English", "Hindi", "Kannada", "Tamil", "Telugu"])
    .showOtherOption(true)
    .setRequired(true);

  // ---------- Specialisation ----------
  form.addPageBreakItem().setTitle("Specialisation");

  form.addCheckboxItem()
    .setTitle("Primary training goals supported")
    .setHelpText(
      "Avoid medical claims. Prenatal and postnatal are out of scope for now, see docs/PROJECT.md."
    )
    .setChoiceValues([
      "General fitness", "Weight loss", "Strength", "Muscle gain",
      "Beginner fitness", "Women's fitness", "Mobility", "Functional fitness",
      "PCOS-aware fitness"
    ])
    .setRequired(true);

  // ---------- Service ----------
  form.addPageBreakItem().setTitle("Service");

  form.addCheckboxItem()
    .setTitle("Training format")
    .setChoiceValues(["Society gym", "Client gym", "Home", "Outdoor", "Online"])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Locality served")
    .setHelpText(
      "Broad areas, e.g. Koramangala or HSR Layout, not a restrictive list of named " +
      "societies, you are not limited to only these."
    )
    .setChoiceValues(["Koramangala", "HSR Layout"])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Any other localities or specific detail")
    .setHelpText("Optional, use this if a single word doesn't capture where you train.")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Maximum travel distance (km)")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(false);

  form.addListItem()
    .setTitle("Session length")
    .setChoiceValues(["45 minutes", "60 minutes", "75 minutes", "90 minutes"])
    .setRequired(true);

  // ---------- Commercial ----------
  form.addPageBreakItem().setTitle("Commercial");

  form.addTextItem()
    .setTitle("Price per session (INR)")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);

  form.addTextItem()
    .setTitle("Typical monthly package price (INR)")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Trial session offered?")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  // ---------- Availability ----------
  form.addPageBreakItem().setTitle("Availability");

  form.addCheckboxItem()
    .setTitle("Days available")
    .setChoiceValues([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Time windows")
    .setHelpText('e.g. "6:00 to 10:00 AM weekdays, 7:00 to 9:00 AM weekends"')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Currently accepting new clients?")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Number of currently open slots")
    .setValidation(FormApp.createTextValidation().requireWholeNumber().build())
    .setRequired(false);

  // ---------- Credibility, do not block listing ----------
  form.addPageBreakItem().setTitle("Credibility (optional, won't block your listing)");

  form.addParagraphTextItem()
    .setTitle("Prior client testimonials")
    .setHelpText("One to three, if you have them. We'll confirm permission to display separately.")
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle("References available?")
    .setChoiceValues(["Yes", "No"])
    .setRequired(false);

  // ---------- Compliance ----------
  form.addPageBreakItem().setTitle("Compliance");

  form.addFileUploadItem()
    .setTitle("Identity document")
    .setHelpText("Government ID or other accepted proof. Stored privately, never published.")
    .setRequired(false);

  // ---------- Consent ----------
  form.addPageBreakItem().setTitle("Consent");

  form.addCheckboxItem()
    .setTitle("Consent to list profile")
    .setChoiceValues(["I agree to be listed on Spot's platform"])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Consent to display photo")
    .setChoiceValues(["I agree to have my photo displayed publicly"])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle("Consent to share contact after paid introduction")
    .setChoiceValues(["I agree to have my contact shared with a customer after she completes payment"])
    .setRequired(true);

  return form;
}

function createCustomerRequestForm() {
  const form = FormApp.create("Spot — Request a Trainer Intro");
  form.setDescription(
    "Tell us what you're looking for and we'll connect you with the right trainer. " +
    "We never share your details with anyone except the trainer you're introduced to."
  );

  // ---------- Contact ----------
  form.addTextItem().setTitle("Name").setRequired(true);
  form.addTextItem().setTitle("Phone or WhatsApp").setRequired(true);

  // ---------- Location ----------
  form.addTextItem()
    .setTitle("Area or society")
    .setHelpText("Prefer your exact society if you know it.")
    .setRequired(true);

  // ---------- Goal ----------
  form.addCheckboxItem()
    .setTitle("What are you looking to achieve?")
    .setChoiceValues([
      "General fitness", "Weight loss", "Strength", "Muscle gain",
      "Beginner fitness", "Women's fitness", "PCOS-aware fitness"
    ])
    .setRequired(true);

  // ---------- Preference ----------
  form.addListItem()
    .setTitle("Trainer gender preference")
    .setChoiceValues(["Female", "Male", "No preference"])
    .setRequired(true);

  // ---------- Schedule ----------
  form.addCheckboxItem()
    .setTitle("Preferred days")
    .setChoiceValues([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Preferred time window")
    .setHelpText('e.g. "6 to 8 AM"')
    .setRequired(true);

  // ---------- Budget ----------
  form.addListItem()
    .setTitle("Monthly budget")
    .setChoiceValues(["Under ₹8,000", "₹8,000 to ₹12,000", "₹12,000 to ₹18,000", "₹18,000+"])
    .setRequired(true);

  // ---------- Format ----------
  form.addListItem()
    .setTitle("Where do you want to train?")
    .setChoiceValues(["Society gym", "Client gym", "Home", "Outdoor", "Online"])
    .setRequired(true);

  // ---------- Session ----------
  form.addListItem()
    .setTitle("Preferred session length")
    .setChoiceValues(["45 minutes", "60 minutes", "75 minutes", "90 minutes"])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Anything important for your trainer?")
    .setHelpText(
      "Include any medical conditions, pregnancy, or injuries here, this is passed " +
      "directly to the trainer before your first session."
    )
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Any deal breakers?")
    .setRequired(false);

  // ---------- Consent ----------
  form.addCheckboxItem()
    .setTitle("Consent to be contacted for trainer introductions")
    .setChoiceValues(["I agree to be contacted by Spot about trainer introductions"])
    .setRequired(true);

  return form;
}
