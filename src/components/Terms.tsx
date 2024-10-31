import React from 'react';
import { FileText } from 'lucide-react';

function Terms() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Terms of Use</h1>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing and using this service, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Service Usage</h2>
          <p className="text-gray-600">
            You agree to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Provide accurate information</li>
            <li>Maintain the security of your account</li>
            <li>Comply with Facebook's terms of service</li>
            <li>Not use the service for any illegal purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Content Guidelines</h2>
          <p className="text-gray-600">
            You are responsible for:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>All content posted through our service</li>
            <li>Ensuring you have rights to share posted content</li>
            <li>Complying with intellectual property laws</li>
            <li>Following Facebook's community guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
          <p className="text-gray-600">
            We are not responsible for:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>Content posted through our service</li>
            <li>Service interruptions or data loss</li>
            <li>Third-party actions or content</li>
            <li>Changes to Facebook's API or policies</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Terms;