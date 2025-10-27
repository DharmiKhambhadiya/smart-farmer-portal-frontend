import React from "react";
import {
  FaShieldAlt,
  FaUserShield,
  FaLock,
  FaGlobeAmericas,
} from "react-icons/fa";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-blue-50 py-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Privacy <span className="text-emerald-600">Policy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Smart Farmer Portal, we are committed to protecting your privacy
            and ensuring the security of your personal information. This policy
            explains how we collect, use, and safeguard your data.
          </p>
          <div className="mt-6 flex justify-center space-x-6 text-emerald-500">
            <FaShieldAlt className="w-8 h-8" />
            <FaUserShield className="w-8 h-8" />
            <FaLock className="w-8 h-8" />
            <FaGlobeAmericas className="w-8 h-8" />
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
              Smart Farmer Portal, we are dedicated to providing a secure
              platform for farmers to manage crops, purchase agricultural
              products, and access expert insights. This Privacy Policy outlines
              our practices regarding the collection, use, and disclosure of
              your information when you use our website and services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using Smart Farmer Portal, you agree to the terms
              of this Privacy Policy. If you do not agree, please do not use our
              services.
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              2. Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We collect various types of information to provide and improve our
              services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Personal Information:</strong> When you register, log
                in, or make purchases, we collect details such as your name,
                email address, phone number, shipping address, and payment
                information.
              </li>
              <li>
                <strong>Farming Data:</strong> Information related to your
                crops, farm location, and agricultural activities to provide
                personalized recommendations.
              </li>
              <li>
                <strong>Usage Data:</strong> Automatically collected data
                including IP address, browser type, device information, and
                pages visited on our site.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies to enhance
                user experience, track preferences, and analyze site traffic.
              </li>
            </ul>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your information helps us deliver a better experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                To process orders, manage your account, and provide customer
                support.
              </li>
              <li>
                To offer personalized farming advice, product recommendations,
                and updates.
              </li>
              <li>
                To improve our website, services, and user experience through
                analytics.
              </li>
              <li>
                To send promotional emails, newsletters, and alerts (with your
                consent).
              </li>
              <li>To ensure security and prevent fraud.</li>
            </ul>
          </section>

          {/* Section 4: Sharing Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              4. Sharing Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We may share it with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Service providers for payment processing, shipping, and
                analytics (e.g., Stripe, Google Analytics).
              </li>
              <li>
                Partners for collaborative farming insights or promotions (with
                your consent).
              </li>
              <li>
                Legal authorities if required by law or to protect our rights.
              </li>
            </ul>
          </section>

          {/* Section 5: Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              5. Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures, including
              encryption and secure servers, to protect your data. However, no
              method is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6: Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              6. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Access, update, or delete your personal information.</li>
              <li>Opt-out of marketing communications.</li>
              <li>Request data portability.</li>
              <li>Lodge a complaint with a data protection authority.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:sfp2005@sfp.com"
                className="text-emerald-600 hover:underline"
              >
                sfp2005@sfp.com
              </a>
              .
            </p>
          </section>

          {/* Section 7: Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              7. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be
              posted on this page with the updated effective date. Continued use
              of our services constitutes acceptance of the revised policy.
            </p>
          </section>

          {/* Section 8: Contact Us */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-emerald-200 pb-2">
              8. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at:
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
