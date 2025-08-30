export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl p-8 shadow-xl border border-white/20">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-slate-700 space-y-6">
            <p className="text-sm text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-medium text-slate-700 mb-2">Personal Information</h3>
              <p>
                When you create an account, we collect information such as your name, email address, and profile
                information. When you connect social media accounts, we access publicly available information from those
                platforms.
              </p>

              <h3 className="text-xl font-medium text-slate-700 mb-2 mt-4">Usage Information</h3>
              <p>
                We collect information about how you use our Service, including pages visited, features used, and
                interactions with content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To personalize your experience</li>
                <li>To communicate with you about your account</li>
                <li>To improve our Service and develop new features</li>
                <li>To ensure the security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Social Media Integration</h2>
              <p>
                When you connect social media accounts, we only access information that is publicly available or that
                you explicitly authorize. We do not store your social media passwords or credentials. The integration
                allows us to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Display your public profile information</li>
                <li>Show your recent posts and content</li>
                <li>Aggregate your social media statistics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except as
                described in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in operating our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
                100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Disconnect social media integrations</li>
                <li>Control the visibility of your profile</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide
                personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">8. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">9. International Users</h2>
              <p>
                If you are accessing our Service from outside the United States, please be aware that your information
                may be transferred to, stored, and processed in the United States.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@gettoknowme.com.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
