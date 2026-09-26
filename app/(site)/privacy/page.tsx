import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contact } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Shanghai Global Auto Parts LLC — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="h1-page text-ink">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: September 26, 2026</p>

          <div className="prose prose-slate mt-10 max-w-none">
            <p>
              Shanghai Global Auto Parts LLC (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;)
              respects your privacy and is committed to protecting the personal information you
              share with us. This Privacy Policy explains what information we collect, how we use
              it, and the choices you have.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information when you use this website:</p>
            <ul>
              <li>
                Information you provide directly, such as your name, email address, phone number,
                and vehicle/VIN details submitted through contact, enquiry, or careers forms.
              </li>
              <li>
                Automatically collected information, such as IP address, browser type, device
                information, and pages visited, gathered through cookies and similar analytics
                technologies.
              </li>
              <li>Files you upload, such as resumes submitted through our Careers page.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to product enquiries, quotes, and customer support requests.</li>
              <li>Process job applications submitted through our Careers page.</li>
              <li>Improve our website, products, and services.</li>
              <li>Communicate updates, offers, or information you have requested.</li>
              <li>Comply with legal obligations and protect against fraud or misuse.</li>
            </ul>

            <h2>3. Sharing of Information</h2>
            <p>
              We do not sell your personal information. We may share information with trusted
              service providers who help us operate this website (such as hosting or analytics
              providers), or where required by law or to protect our legal rights.
            </p>

            <h2>4. Cookies</h2>
            <p>
              We may use cookies and similar technologies to remember your preferences and
              understand how visitors use our site. You can control cookies through your browser
              settings; disabling cookies may affect some site functionality.
            </p>

            <h2>5. Data Retention &amp; Security</h2>
            <p>
              We retain personal information only as long as necessary for the purposes described
              above and take reasonable technical and organizational measures to protect it against
              unauthorized access, loss, or misuse.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or request
              deletion of your personal information. To exercise these rights, contact us using the
              details below.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
              date at the top of this page reflects the most recent revision.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your information,
              contact us at{" "}
              <a href={`mailto:${contact.emails.primary}`} className="text-brand-red">
                {contact.emails.primary}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
