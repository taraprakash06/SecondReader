import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Second Reader",
  description: "Privacy Policy for Second Reader, a Write to Right initiative.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-[color:var(--ink)] sm:px-6 sm:py-14">
      <Link
        href="/"
        className="text-sm font-medium text-[color:var(--ink-muted)] hover:text-[color:var(--ink)]"
      >
        ← Home
      </Link>

      <article className="mt-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Privacy Policy — Second Reader</h1>
        <p className="mt-2 text-sm text-[color:var(--ink-muted)]">Last Updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[color:var(--ink-muted)] sm:text-base sm:leading-[1.65]">
          <p>
            Second Reader (“Second Reader,” “we,” “our,” or “us”) is a platform designed to help writers find trusted
            critique partners and second readers through structured feedback exchanges.
          </p>
          <p>
            Because users share personal writing, creative work, and feedback through the platform, we take privacy
            seriously and aim to create a thoughtful and respectful environment for writers and readers alike.
          </p>
          <p className="font-medium text-[color:var(--ink)]">
            By using Second Reader, you agree to the practices described in this Privacy Policy.
          </p>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">1. Information We Collect</h2>
            <p className="mt-3">
              We may collect the following information when users create accounts or use the platform:
            </p>
            <p className="mt-3 font-medium text-[color:var(--ink)]">Account Information</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Name or username</li>
              <li>Email address</li>
              <li>Profile information</li>
              <li>Genres/interests</li>
              <li>Reader or writer preferences</li>
            </ul>
            <p className="mt-3 font-medium text-[color:var(--ink)]">User Content</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Written submissions</li>
              <li>Feedback comments</li>
              <li>Reader profiles and feedback samples</li>
              <li>Messages or interactions shared through the platform</li>
            </ul>
            <p className="mt-3 font-medium text-[color:var(--ink)]">Usage Information</p>
            <p className="mt-2">We may collect limited technical information such as:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Browser type</li>
              <li>Device information</li>
              <li>General usage activity</li>
              <li>Log data</li>
            </ul>
            <p className="mt-3">This information helps improve the platform and maintain security.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">
              2. Personal Writing and Creative Work
            </h2>
            <p className="mt-3">Second Reader is built around the exchange of unpublished creative work.</p>
            <p className="mt-3">Users understand that:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>pieces shared on the platform may be read by other approved users,</li>
              <li>feedback may be exchanged between writers and readers,</li>
              <li>
                and participation involves sharing creative writing with members of the platform community.
              </li>
            </ul>
            <p className="mt-3">Writers retain ownership of all writing they upload to Second Reader.</p>
            <p className="mt-3">
              Users may remove their submissions from public browsing at any time through their profile settings.
            </p>
            <p className="mt-3">
              We ask all users to treat others’ writing respectfully and not reproduce, distribute, publish, or share
              another user’s work outside the platform without permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">
              3. Minors and Users Under 18
            </h2>
            <p className="mt-3">Some users of Second Reader may be under the age of 18.</p>
            <p className="mt-3">
              We are committed to maintaining a respectful and safe environment for younger writers and readers.
            </p>
            <p className="mt-3">If you are under 18:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>please use the platform responsibly,</li>
              <li>avoid sharing unnecessary personal information,</li>
              <li>
                and speak with a parent, guardian, teacher, or program leader if you have concerns about your experience
                on the platform.
              </li>
            </ul>
            <p className="mt-3">
              Organizations, schools, or educational programs using Second Reader with minors are responsible for
              ensuring appropriate supervision and consent practices where required.
            </p>
            <p className="mt-3">Second Reader does not knowingly sell or publicly disclose minors’ personal information.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">4. How We Use Information</h2>
            <p className="mt-3">We use collected information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>operate and improve the platform,</li>
              <li>facilitate feedback exchanges between users,</li>
              <li>provide account access and support,</li>
              <li>maintain platform security,</li>
              <li>communicate important updates,</li>
              <li>and improve user experience.</li>
            </ul>
            <p className="mt-3">
              We may also use anonymized or aggregated feedback data to improve the platform and understand how users
              engage with the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">5. Data Sharing</h2>
            <p className="mt-3">We do not sell personal information to third parties.</p>
            <p className="mt-3">
              User writing, feedback, and profile information are shared only within the functioning of the platform and
              according to user activity and permissions.
            </p>
            <p className="mt-3">We may share limited information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                with service providers necessary to operate the platform (such as hosting or authentication providers),
              </li>
              <li>when legally required,</li>
              <li>or when necessary to protect the safety or integrity of the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">6. Data Security</h2>
            <p className="mt-3">
              We make reasonable efforts to protect user data and creative work from unauthorized access.
            </p>
            <p className="mt-3">
              However, no online platform or service can guarantee absolute security. Users understand that sharing
              writing and information online carries some level of inherent risk.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">
              7. Removing Content and Accounts
            </h2>
            <p className="mt-3">Users may:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>remove submissions from public browsing,</li>
              <li>edit profile information,</li>
              <li>or request deletion of their account.</li>
            </ul>
            <p className="mt-3">
              Some limited backup or system records may temporarily remain in secure storage after deletion.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">8. Community Conduct</h2>
            <p className="mt-3">
              Second Reader is intended to foster thoughtful, constructive, and respectful creative exchange.
            </p>
            <p className="mt-3">Users agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>harass or threaten others,</li>
              <li>misuse personal information,</li>
              <li>reproduce another user’s work without permission,</li>
              <li>or attempt unauthorized access to accounts or platform data.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or remove accounts that violate community standards or compromise platform
              safety.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">9. Changes to This Policy</h2>
            <p className="mt-3">We may update this Privacy Policy as the platform evolves.</p>
            <p className="mt-3">
              If significant changes are made, we will update the “Last Updated” date above and may notify users through
              the platform.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[color:var(--ink)] sm:text-lg">10. Contact</h2>
            <p className="mt-3">
              If you have questions about this Privacy Policy or concerns about your data or experience on the platform,
              please contact:
            </p>
            <p className="mt-4 font-medium text-[color:var(--ink)]">Second Reader</p>
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
