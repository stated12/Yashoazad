// Single place to finalise the legal pages.
//   status:    "draft" shows a notice on each legal page and asks search engines not to index it.
//              Change to "approved" only after the details below are confirmed and the pages are reviewed.
//   showFlags: true highlights every item that still needs confirmation. Set false when all are resolved.
//   null values are unconfirmed and appear as highlighted placeholders while showFlags is true.
export const LEGAL = {
  status: "draft" as "draft" | "approved",
  showFlags: true,
  updated: "30 October 2026",
  copyrightHolder: "Yashovardhan Jha Azad", // confirm: person or company that owns the site content
  operator: null as string | null,          // legal name and postal address of the person or entity running the site
  privacyContact: null as string | null,    // email address for privacy requests
  grievanceOfficer: null as string | null,  // name and contact of the person who handles complaints, if required
  jurisdiction: null as string | null,      // governing law and courts, e.g. a city
};
