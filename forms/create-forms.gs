/**
 * Creates the two mttle Google Forms (Trainer Intake, Customer Request).
 *
 * This mirrors the ACTUAL live forms (linked from the operating workbook),
 * not an idealized spec, they were hand-built and customized after the
 * first version of this script ran, so this version was rewritten field
 * for field against forms.gle/hyp6LJ4Rhimr5JG17 (trainer) and
 * forms.gle/vfYyygj541wUVYYN6 (customer) to match exactly: same fields,
 * same order, same choices, same required flags, single page, no file
 * uploads (photos and ID are handled outside the form entirely).
 *
 * This is a one-off scaffolding script, not the ongoing automation ruled
 * out by the local platform playbook's settled decision 12. Only useful if you ever need to
 * recreate a form from scratch, e.g. after an accidental deletion, or to
 * set up a near-identical form for a new city. It does not touch the
 * live forms already in use.
 *
 * HOW TO RUN
 * 1. Go to script.google.com, New project.
 * 2. Delete the placeholder code, paste this whole file in.
 * 3. Save (Ctrl/Cmd+S), name the project something like "mttle Form Builder".
 * 4. In the function dropdown at the top, select "createAllMttleForms", click Run.
 * 5. First run asks you to authorize the script (it needs permission to
 *    create files in your Drive, since a Form is a Drive file). Approve it.
 * 6. Open View > Logs (or Execution log) to get both forms' edit and live
 *    links. The edit link is what you open to review/tweak; the live link
 *    is what you'd actually send to a trainer or customer.
 * 7. Each form starts fully private, only you can see or edit it. Nothing
 *    is shared or published anywhere by this script.
 * 8. Both forms turn on "Collect email addresses". Apps Script's basic
 *    FormApp service can turn this on, but cannot pick between "Verified"
 *    (requires Google sign-in, which is what the live forms currently use)
 *    and "Responder input" (just a typed email, no sign-in). Check Settings
 *    > Responses in the form itself after running and set it to Verified
 *    if you want it to match the live forms exactly.
 *
 * AFTER RUNNING
 * - These are standalone forms, responses land in each form's own
 *   "Responses" tab until you link one to a spreadsheet (Responses >
 *   the green Sheets icon). The live forms are already linked directly
 *   to the operating workbook, a freshly created form from this script
 *   would need that link set up again by hand.
 * - Re-running this script creates two brand-new forms each time, it does
 *   not edit existing ones. Delete the old ones from Drive if you re-run.
 */

function createAllMttleForms() {
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
  const form = FormApp.create("mttle Trainer Details");
  form.setCollectEmail(true); // set to Verified in Settings > Responses to match the live form

  form.addTextItem().setTitle("Trainer First Name").setRequired(true);
  form.addTextItem().setTitle("Trainer Last Name").setRequired(true);
  form.addTextItem().setTitle("Trainer Phone / WhatsApp").setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Trainer Gender")
    .setChoiceValues(["Female", "Male"])
    .showOtherOption(true)
    .setRequired(true);

  form.addTextItem().setTitle("Address").setRequired(true);
  form.addTextItem().setTitle("Area").setRequired(true);

  form.addTextItem()
    .setTitle("Email")
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(false);

  form.addTextItem()
    .setTitle("Years of PT experience")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Training Goals Supported/ Specialization")
    .setChoiceValues([
      "General fitness", "Weight loss & Mobility", "Strength/Muscle gain",
      "PCOS-aware fitness", "Physiotherpy", "Corrective exercise specialist"
    ])
    .showOtherOption(true)
    .setRequired(false);

  form.addTextItem().setTitle("Previous gyms / employers").setRequired(false);
  form.addTextItem().setTitle("Session length").setRequired(false);

  form.addTextItem()
    .setTitle("Price per session")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);

  form.addTextItem()
    .setTitle("Typical monthly package price")
    .setValidation(FormApp.createTextValidation().requireNumber().build())
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Currently accepting new clients?")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Number of currently open slots")
    .setValidation(FormApp.createTextValidation().requireWholeNumber().build())
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Days available")
    .setChoiceValues([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Available time window")
    .setChoiceValues(["Morning", "Evening"])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle("Possible slots marked in sheet")
    .setChoiceValues(["Yes"])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Trial session offered?")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  form.addTextItem().setTitle("Languages spoken").setRequired(false);
  form.addTextItem().setTitle("Certifications").setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Prior client testimonials? Name and number marked in sheet")
    .setChoiceValues(["Yes"])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Identity document type")
    .setChoiceValues(["Aadhar", "Pan", "Driving License"])
    .showOtherOption(true)
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("Anything important for your customers? Any deal breakers?")
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle("Consent to list profile")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Consent to display photo")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Consent to share contact after paid introduction")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  return form;
}

function createCustomerRequestForm() {
  const form = FormApp.create("mttle Customer Details");
  form.setCollectEmail(true); // set to Verified in Settings > Responses to match the live form

  form.addTextItem().setTitle("Customer Phone").setRequired(true);
  form.addTextItem().setTitle("Customer First Name").setRequired(true);
  form.addTextItem().setTitle("Customer Last Name").setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Customer Gender")
    .setChoiceValues(["Male", "Female"])
    .showOtherOption(true)
    .setRequired(false);

  form.addTextItem().setTitle("Address/Society").setRequired(true);
  form.addTextItem().setTitle("Area").setRequired(true);
  form.addTextItem().setTitle("Goals").setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle("Trainer gender preference")
    .setChoiceValues(["Male", "Female"])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Preferred days")
    .setChoiceValues([
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle("Preferred time window")
    .setChoiceValues(["Morning", "Evening"])
    .setRequired(false);

  form.addTextItem().setTitle("Monthly budget").setRequired(false);

  form.addParagraphTextItem()
    .setTitle("Anything important for your trainer? Any deal breakers?")
    .setHelpText(
      "Include any medical conditions, pregnancy, or injuries here, this is passed " +
      "directly to the trainer before the first session."
    )
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle("Consent to be contacted for trainer introductions")
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  return form;
}
