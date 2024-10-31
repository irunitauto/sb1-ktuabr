import React from 'react';
import { Shield } from 'lucide-react';

function Privacy() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
          <p className="text-gray-600">
            We collect only the necessary data required to provide our social media management services:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Google account information for Sheet access</li>
            <li>Facebook Page access tokens</li>
            <li>Content data from uploaded spreadsheets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Usage</h2>
          <p className="text-gray-600">
            Your data is used solely for the purpose of scheduling and publishing posts to your selected Facebook Pages. We do not share or sell your information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Data Security</h2>
          <p className="text-gray-600">
            We implement industry-standard security measures to protect your data:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Encrypted data transmission</li>
            <li>Secure OAuth 2.0 authentication</li>
            <li>Regular security audits</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
          <p className="text-gray-600">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Access your data</li>
            <li>Request data deletion</li>
            <li>Revoke access permissions</li>
            <li>Export your data</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Privacy;