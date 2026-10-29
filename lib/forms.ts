// One definition used by both the browser form and the server validation.
export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "datetime" | "checkbox" | "date";
  required?: boolean;
  options?: string[];
  help?: string;
  max?: number;
};
export type FormDef = {
  type: string;
  title: string; // used in the email subject
  submit: string;
  success: string;
  notify: boolean; // email Mr. Azad's inbox
  fields: Field[];
};

const name: Field = { name: "name", label: "Your name", type: "text", required: true, max: 120 };
const email: Field = { name: "email", label: "Email", type: "email", required: true, max: 200 };
const phone: Field = { name: "phone", label: "Phone (optional)", type: "tel", max: 40 };
const org: Field = { name: "organisation", label: "Organisation", type: "text", max: 200 };

export const FORMS: Record<string, FormDef> = {
  contact: {
    type: "contact",
    title: "General enquiry",
    submit: "Send message",
    success: "Thank you. Your message has been sent.",
    notify: true,
    fields: [
      name, email, phone,
      { name: "category", label: "Enquiry type", type: "select", required: true, options: ["Media", "Academic", "Institutional", "Professional", "Book or publication", "Other"] },
      { name: "message", label: "Message", type: "textarea", required: true, max: 3000 },
    ],
  },
  speaking: {
    type: "speaking",
    title: "Speaking enquiry",
    submit: "Send speaking enquiry",
    success: "Thank you. Your speaking enquiry has been sent. A reply will follow once availability is checked.",
    notify: true,
    fields: [
      { ...name, label: "Contact person" }, org, email, phone,
      { name: "topic", label: "Proposed topic", type: "text", required: true, max: 300 },
      { name: "audience", label: "Audience and approximate size", type: "text", required: true, max: 300 },
      { name: "date", label: "Preferred date", type: "date" },
      { name: "format", label: "Format", type: "select", required: true, options: ["In person", "Online", "Hybrid"] },
      { name: "location", label: "City or venue", type: "text", max: 200 },
      { name: "requirements", label: "Other requirements", type: "textarea", max: 2000 },
    ],
  },
  consult: {
    type: "consult",
    title: "Consulting booking request",
    submit: "Request a session",
    success: "Thank you. Your request has been received. It is a request, not a confirmed booking. You will hear back after review.",
    notify: true,
    fields: [
      name, org, email, phone,
      { name: "area", label: "Area of discussion", type: "select", required: true, options: ["Governance and institutional effectiveness", "Strategic and security risk", "Crisis preparedness", "RTI and transparency", "Leadership and ethics", "Other"] },
      { name: "mode", label: "Preferred mode", type: "select", required: true, options: ["Video call", "Phone call", "In person"] },
      { name: "slot1", label: "Preferred time, first choice", type: "datetime", required: true },
      { name: "slot2", label: "Second choice", type: "datetime" },
      { name: "slot3", label: "Third choice", type: "datetime" },
      { name: "brief", label: "Brief description of what you need", type: "textarea", required: true, max: 3000 },
      { name: "consent", label: "I understand this is a request, that fees are agreed before a session is confirmed, and that no confidential or classified information will be sought.", type: "checkbox", required: true },
    ],
  },
  exclusive: {
    type: "exclusive",
    title: "Exclusive Insights access request",
    submit: "Request early access",
    success: "Thank you. You are on the list and will be told when Exclusive Insights opens.",
    notify: true,
    fields: [name, email, { name: "interest", label: "What would you most like to read? (optional)", type: "textarea", max: 1000 }],
  },
  learning: {
    type: "learning",
    title: "Students and learning interest",
    submit: "Register interest",
    success: "Thank you. Your interest has been registered.",
    notify: true,
    fields: [
      name, email,
      { name: "audience", label: "I am a", type: "select", required: true, options: ["UPSC aspirant", "University student", "Young professional", "Institution or faculty", "Other"] },
      { name: "interest", label: "What would you like to learn? (optional)", type: "textarea", max: 1000 },
    ],
  },
  newsletter: {
    type: "newsletter",
    title: "Newsletter signup",
    submit: "Subscribe",
    success: "Thank you. You are subscribed.",
    notify: false,
    fields: [email],
  },
};
