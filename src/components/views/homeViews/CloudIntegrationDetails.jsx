import React from "react";

const CloudIntegrationDetails = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl text-gray-900 dark:text-white font-semibold mb-4">
        ☁️ Cloud-Native Architecture
      </h2>
      <div className="space-y-2 text-gray-700 dark:text-gray-200">
        <p>Highlights of our integration strategy:</p>
        <ul className="list-disc pl-5">
          <li>
            Static HTML hosted via Firebase Hosting or Azure Static Web Apps.
          </li>
          <li>
            REST APIs implemented via Next.js API routes or Firebase Functions.
          </li>
          <li>
            Storage integration with Firebase Storage / Azure Blob Storage.
          </li>
          <li>
            Data fetched through RESTful endpoints (e.g.,{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
              /api/v1/media/feed
            </code>
            ).
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CloudIntegrationDetails;
