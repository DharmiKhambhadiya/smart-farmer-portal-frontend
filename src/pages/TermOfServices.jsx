import React from "react";
import {
  FaTractor,
  FaBalanceScale,
  FaFileContract,
  FaUsers,
} from "react-icons/fa";

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Terms of <span className="text-emerald-600">Service</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to Smart Farmer Portal. These Terms of Service govern your
            use of our website and services. By accessing or using our platform,
            you agree to be bound by these terms.
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-emerald-500">
            <FaTractor className="w-8 h-8" />
            <FaBalanceScale className="w-8 h-8" />
            <FaFileContract className="w-8 h-8" />
            <FaUsers className="w-8 h-8" />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service ("Terms") apply to your access and use of
              the Smart Farmer Portal ("Platform"), including our website,
              mobile applications, and related services. Smart Farmer Portal
              ("we," "us," or "our") provides tools for farmers to manage crops,
              purchase agricultural products, and access expert advice. By using
              our Platform, you agree to these Terms and our Privacy Policy.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you do not agree to these Terms, please do not use our
              Platform.
            </p>
          </section>

          {/* Section 2: Use of the Platform */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              2. Use of the Platform
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You may use the Platform for lawful purposes related to farming,
              purchasing agricultural products, or accessing agricultural
              resources. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Provide accurate and complete information during registration
                and transactions.
              </li>
              <li>Maintain the security of your account credentials.</li>
              <li>
                Not use the Platform for any illegal or unauthorized purpose.
              </li>
              <li>
                Not attempt to disrupt or interfere with the Platform’s
                operations, including through hacking or introducing malware.
              </li>
            </ul>
          </section>

          {/* Section 3: Account Responsibilities */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              3. Account Responsibilities
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To access certain features, such as purchasing products or
              managing crops, you must create an account. You are responsible
              for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Keeping your account information up to date.</li>
              <li>Not sharing your account credentials with others.</li>
              <li>
                Notifying us immediately of any unauthorized access to your
                account.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </section>

          {/* Section 4: Payments and Transactions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              4. Payments and Transactions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform allows you to purchase agricultural products and
              services. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Pay all applicable fees and taxes for your purchases.</li>
              <li>
                Provide valid payment information through our secure payment
                processors.
              </li>
              <li>
                Accept our refund and return policies, which are available at
                checkout or upon request.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              All payments are processed securely through third-party providers
              (e.g., Stripe). We are not responsible for errors or issues caused
              by these providers.
            </p>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              5. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Platform, including text, images, logos, and
              software, is owned by Smart Farmer Portal or its licensors and is
              protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Reproduce, distribute, or modify our content without permission.
              </li>
              <li>
                Use our trademarks, such as the Smart Farmer logo, without
                written consent.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You may submit content (e.g., reviews or farm data), which grants
              us a non-exclusive, royalty-free license to use, display, and
              store it for Platform purposes.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform is provided "as is" without warranties of any kind.
              We are not liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Errors, inaccuracies, or interruptions in service.</li>
              <li>Losses or damages arising from your use of the Platform.</li>
              <li>
                Outcomes from following agricultural advice provided on the
                Platform.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Our total liability shall not exceed the amount you paid for
              services in the past 12 months.
            </p>
          </section>

          {/* Section 7: Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              7. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may suspend or terminate your access to the Platform if you
              violate these Terms or engage in harmful conduct. You may
              terminate your account at any time by contacting us or using
              account settings.
            </p>
          </section>

          {/* Section 8: Governing Law */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              8. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall
              be resolved in the courts of Botad, Gujarat, India.
            </p>
          </section>

          {/* Section 9: Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              9. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms periodically. Changes will be posted on
              this page with the updated effective date. Continued use of the
              Platform constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 10: Contact Us */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              10. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about these Terms, please contact us at:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Email:{" "}
                <a
                  href="mailto:sfp2005@sfp.com"
                  className="text-emerald-600 hover:underline"
                >
                  sfp2005@sfp.com
                </a>
              </li>
              <li>Phone: +91 9876543211</li>
              <li>
                Address: 312E, Unknown Street, Undefined Road, Botad, Gujarat,
                India
              </li>
            </ul>
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-gray-500">
          Effective Date: September 29, 2025
        </div>
      </div>
    </div>
  );
};
