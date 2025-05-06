import React from "react";

const CloudIntegrationDetails = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cloud-Native Architecture</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          Static HTML hosted via Firebase Hosting or Azure Static Web Apps.
        </li>
        <li>
          REST APIs implemented via Next.js API routes or Firebase Functions.
        </li>
        <li>Storage integration with Firebase Storage / Azure Blob Storage.</li>
        <li>
          Data fetched through RESTful endpoints (e.g., `/api/v1/media/feed`).
        </li>
      </ul>
    </section>
  );
};

export default CloudIntegrationDetails;
