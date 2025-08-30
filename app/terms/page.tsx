export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-8 shadow-xl border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
            <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using GetToKnowMe ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Description of Service</h2>
              <p>
                GetToKnowMe is a platform that allows users to create personalized profile pages that aggregate their
                social media presence and content. Users can connect various social media accounts, customize their
                profile appearance, and share their centralized digital identity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. User Accounts</h2>
              <p>
                To use certain features of the Service, you must register for an account. You are responsible for
                maintaining the confidentiality of your account credentials and for all activities that occur under your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. User Content</h2>
              <p>
                You retain ownership of any content you post or share through the Service. By posting content, you grant
                GetToKnowMe a non-exclusive, worldwide, royalty-free license to use, display, and distribute your
                content in connection with the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Social Media Integration</h2>
              <p>
                When you connect third-party social media accounts, you authorize GetToKnowMe to access and display
                publicly available information from those platforms. We do not store your social media credentials and
                only access data you explicitly authorize.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Prohibited Uses</h2>
              <p>
                You may not use the Service for any unlawful purpose or to solicit others to perform unlawful acts. You
                may not transmit any content that is defamatory, offensive, or infringes on the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third
                parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. Disclaimer</h2>
              <p>
                The Service is provided "as is" without any representations or warranties. We do not warrant that the
                Service will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of any material changes via
                email or through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">11. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at legal@gettoknowme.com.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
