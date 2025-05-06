import React from "react";

const CreatorFeatures = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Creator Role Capabilities</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Exclusive upload access through a dedicated Creator View.</li>
        <li>Metadata support: Title, Caption, Location, and Tagged People.</li>
        <li>Upload via Firebase Storage with REST API submission.</li>
        <li>
          Sign-up users are allowed to use Creator mode directly — no separate public
          interface is provided for enrolling creators.
        </li>
      </ul>
    </section>
  );
};

export default CreatorFeatures;
