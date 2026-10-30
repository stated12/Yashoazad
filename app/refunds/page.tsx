import type { Metadata } from "next";
import { Confirm, H, LegalPage, noindexWhileDraft } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Refund and cancellation terms for planned paid services.",
  alternates: { canonical: "/refunds" },
  robots: noindexWhileDraft(),
};

export default function Refunds() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      intro="No payments are taken on this website at present. This page will apply to paid services once they open."
    >
      <H>1. When this applies</H>
      <p>
        Paid services are planned: consulting sessions, masterclasses and workshops, and Exclusive Insights subscriptions. Until a service is listed with a price and an online payment option, nothing on this site is charged for, and enquiry forms are free to submit.
      </p>

      <H>2. Consulting sessions and events</H>
      <p>
        <Confirm>cancellation window, rescheduling rules, refund amount or percentage, and what happens if the organiser or speaker cancels</Confirm>
      </p>

      <H>3. Subscriptions (Exclusive Insights)</H>
      <p>
        <Confirm>billing period, how to cancel, whether partial periods are refunded, and refund rules for accidental or duplicate payments</Confirm>
      </p>

      <H>4. Courses and workshops</H>
      <p>
        <Confirm>refund rules before and after the start date, and for digital content once accessed</Confirm>
      </p>

      <H>5. How refunds are paid</H>
      <p>
        <Confirm>refund timeline and method, which depend on the payment provider chosen. A published refund policy is normally required when applying for a payment gateway account</Confirm>
      </p>

      <H>6. How to ask</H>
      <p>
        <Confirm>contact email and the details to include in a request</Confirm>
      </p>
    </LegalPage>
  );
}
