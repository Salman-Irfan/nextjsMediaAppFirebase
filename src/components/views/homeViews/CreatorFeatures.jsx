import React from "react";

const CreatorFeatures = () => {
  return (
    <article className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md mb-8">
      <header>
        <h2 className="text-xl md:text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
          Creator Role Capabilities
        </h2>
      </header>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Exclusive upload access through a dedicated Creator View.</li>
        <li>Metadata support: Title, Caption, Location, and Tagged People.</li>
        <li>Upload via Firebase Storage with REST API submission.</li>
        <li>
          Sign-up users are allowed to use Creator mode directly — no separate
          public interface is provided for enrolling creators.
        </li>
      </ol>
    </article>
  );
};

export default CreatorFeatures;
