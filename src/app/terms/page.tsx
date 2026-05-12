import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Second Reader",
  description: "Terms of Service for Second Reader, a Write to Right initiative.",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-[color:var(--ink)] sm:px-6 sm:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
      >
        ← Home
      </Link>

      <article className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Terms of Service — Second Reader</h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Last Updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[color:var(--ink-muted)] sm:text-base sm:leading-[1.65]">
          <p>Welcome to Second Reader.</p>
          <p>
            Second Reader (“Second Reader,” “we,” “our,” or “us”) is a platform designed to help writers find trusted
            critique partners and second readers through structured creative feedback exchanges.
          </p>
          <p className="font-medium text-[color:var(--ink)]">
            By creating an account or using the platform, you agree to these Terms of Service (“Terms”).
          </p>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">1. Eligibility</h2>
            <p className="mt-3">You may use Second Reader only if you can form a binding agreement under applicable law.</p>
            <p className="mt-3">
              Users under the age of 18 may use the platform, including through educational organizations or writing
              programs, but should do so responsibly and with appropriate guidance from parents, guardians, teachers, or
              program leaders where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">2. User Accounts</h2>
            <p className="mt-3">To access certain features, users may need to create an account.</p>
            <p className="mt-3">You agree to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>provide accurate information,</li>
              <li>maintain the security of your account,</li>
              <li>and notify us if you believe your account has been compromised.</li>
            </ul>
            <p className="mt-3">You are responsible for activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">3. User Content and Ownership</h2>
            <p className="mt-3">
              Users retain ownership of all writing, feedback, and creative work they submit to the platform.
            </p>
            <p className="mt-3">
              By uploading content to Second Reader, you grant Second Reader a limited license to host, display, and share
              that content only as necessary for operation of the platform and its feedback features.
            </p>
            <p className="mt-3">Second Reader does not claim ownership over your creative work.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">4. Sharing Writing and Feedback</h2>
            <p className="mt-3">Second Reader is built around the exchange of unpublished creative work.</p>
            <p className="mt-3">By using the platform, users understand that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>their writing may be viewed by approved readers,</li>
              <li>feedback may be exchanged between users,</li>
              <li>and participation involves collaborative creative interaction.</li>
            </ul>
            <p className="mt-3">Users agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>reproduce,</li>
              <li>publish,</li>
              <li>distribute,</li>
              <li>or share another user’s writing outside the platform without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">5. Respectful Conduct</h2>
            <p className="mt-3">Users agree to engage respectfully and constructively with others on the platform.</p>
            <p className="mt-3">You may not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>harass, bully, or threaten others,</li>
              <li>submit abusive or discriminatory content,</li>
              <li>impersonate another person,</li>
              <li>misuse personal information,</li>
              <li>or interfere with the operation or security of the platform.</li>
            </ul>
            <p className="mt-3">
              Second Reader reserves the right to suspend or remove accounts that violate these standards.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">
              6. Platform Access and Availability
            </h2>
            <p className="mt-3">We may modify, suspend, or discontinue parts of the platform at any time.</p>
            <p className="mt-3">Because Second Reader is an evolving platform, some features may change over time.</p>
            <p className="mt-3">We do not guarantee uninterrupted availability or permanent access to any specific feature.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">7. Removal of Content</h2>
            <p className="mt-3">Users may remove submissions from public browsing through their profile settings.</p>
            <p className="mt-3">Second Reader reserves the right to remove content that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>violates these Terms,</li>
              <li>creates safety concerns,</li>
              <li>infringes intellectual property rights,</li>
              <li>or disrupts the platform community.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">8. Intellectual Property</h2>
            <p className="mt-3">
              Second Reader™, including its platform design, branding, software, workflows, and associated intellectual
              property, is owned by Tara Prakash and/or Write to Right.
            </p>
            <p className="mt-3">Users may not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>copy platform code,</li>
              <li>reproduce platform branding,</li>
              <li>reverse engineer the platform,</li>
              <li>or commercially exploit platform materials without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">9. Privacy</h2>
            <p className="mt-3">Use of the platform is also governed by the Second Reader Privacy Policy.</p>
            <p className="mt-3">
              By using Second Reader, you acknowledge that you have read and understood the{" "}
              <Link
                href="/privacy"
                className="font-medium text-[color:var(--brand-magenta)] underline decoration-[color:var(--brand-magenta)]/30 underline-offset-2 hover:decoration-[color:var(--brand-magenta)]"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">10. Disclaimer</h2>
            <p className="mt-3">
              Second Reader provides tools for peer creative feedback and community interaction.
            </p>
            <p className="mt-3">We do not guarantee:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>the quality of feedback,</li>
              <li>the accuracy of user comments,</li>
              <li>publication outcomes,</li>
              <li>or compatibility between users.</li>
            </ul>
            <p className="mt-3">Feedback exchanged on the platform reflects the opinions of individual users.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">11. Limitation of Liability</h2>
            <p className="mt-3">Second Reader is provided on an “as-is” basis.</p>
            <p className="mt-3">To the fullest extent permitted by law, Second Reader shall not be liable for:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>indirect or consequential damages,</li>
              <li>loss of data,</li>
              <li>unauthorized access,</li>
              <li>service interruptions,</li>
              <li>or disputes between users.</li>
            </ul>
            <p className="mt-3">Users understand that sharing creative work online carries inherent risks.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">12. Termination</h2>
            <p className="mt-3">
              We reserve the right to suspend or terminate access to the platform if users violate these Terms or
              compromise the safety or integrity of the platform.
            </p>
            <p className="mt-3">Users may stop using the platform at any time.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">13. Changes to These Terms</h2>
            <p className="mt-3">We may update these Terms as the platform evolves.</p>
            <p className="mt-3">
              Continued use of the platform after changes are posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">
              14. Additional Intellectual Property and User Responsibility Clause
            </h2>
            <p className="mt-3">
              Users retain ownership of all writing and creative work shared on Second Reader.
            </p>
            <p className="mt-3">
              Second Reader does not claim ownership over user submissions and does not monitor, verify, or guarantee the
              originality or conduct of individual users.
            </p>
            <p className="mt-3">
              Users are solely responsible for the content they upload, share, read, or distribute through the platform.
            </p>
            <p className="mt-3">
              Any unauthorized copying, plagiarism, misuse, publication, or distribution of another user’s work by a
              third party or platform user is the responsibility of the individual engaging in that conduct and not the
              responsibility of Second Reader.
            </p>
            <p className="mt-3">
              While Second Reader encourages respectful and ethical creative exchange and may take action against accounts
              reported for plagiarism or misuse, the platform cannot guarantee that user content will never be copied,
              reproduced, or misused by others.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">15. Contact</h2>
            <p className="mt-3">Questions about these Terms may be directed to:</p>
            <p className="mt-4 font-medium text-[color:var(--ink)]">Second Reader™</p>
            <p>A Write to Right initiative</p>
            <p className="mt-3">
              Email:{" "}
              <a
                href="mailto:info@writetoright.co"
                className="font-medium text-[color:var(--brand-magenta)] underline decoration-[color:var(--brand-magenta)]/30 underline-offset-2 hover:decoration-[color:var(--brand-magenta)]"
              >
                info@writetoright.co
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
