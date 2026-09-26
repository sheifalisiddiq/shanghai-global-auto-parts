import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { contact, brandLogoDisclaimer } from "@/lib/data/company";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms & Conditions for using the Shanghai Global Auto Parts LLC website and services.",
};

export default function TermsPage() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="h1-page text-ink">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: September 26, 2026</p>

          <div className="prose prose-slate mt-10 max-w-none">
            <p>
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the Shanghai
              Global Auto Parts LLC website. By accessing or using this website, you agree to be
              bound by these Terms. If you do not agree, please do not use this website.
            </p>

            <h2>1. Use of This Website</h2>
            <p>
              This website is provided for the purpose of browsing our auto parts catalog,
              requesting quotes, and contacting our team. You agree to use it only for lawful
              purposes and not to misuse, disrupt, or attempt unauthorized access to any part of
              the site.
            </p>

            <h2>2. Product Information &amp; Fitment</h2>
            <p>
              Product listings, categories, and vehicle-make/model information are provided for
              general reference only. Part compatibility should always be confirmed with our team
              via VIN or vehicle details before purchase; we do not guarantee fitment based solely
              on information displayed on this website.
            </p>

            <h2>3. Trademarks &amp; Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the
              property of Shanghai Global Auto Parts LLC or its licensors, unless otherwise stated.{" "}
              {brandLogoDisclaimer}
            </p>

            <h2>4. Quotes, Orders &amp; Pricing</h2>
            <p>
              Enquiries and quote requests submitted through this website do not constitute a
              binding order. Pricing, availability, and shipping terms are confirmed separately by
              our sales team before any transaction is finalized.
            </p>

            <h2>5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Shanghai Global Auto Parts LLC shall not be
              liable for any indirect, incidental, or consequential damages arising from the use of
              this website or reliance on information contained in it.
            </p>

            <h2>6. Third-Party Links</h2>
            <p>
              This website may contain links to third-party sites (including social media). We are
              not responsible for the content or practices of any linked third-party sites.
            </p>

            <h2>7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the website after
              changes are posted constitutes acceptance of the revised Terms.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United Arab Emirates, without regard to
              conflict-of-law principles, unless otherwise required by applicable local law.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              Questions about these Terms can be sent to{" "}
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
