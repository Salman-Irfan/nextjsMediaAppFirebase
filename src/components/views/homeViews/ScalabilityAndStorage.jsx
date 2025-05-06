import React from "react";

const ScalabilityAndStorage = () => {
  return (
    <div className="border border-dashed border-purple-300 dark:border-purple-600 rounded-lg px-6 py-8 mb-8">
      <header className="mb-3">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
          Scalability & Storage
        </h2>
      </header>
      <dl className="space-y-3 text-gray-700 dark:text-gray-300">
        <div>
          <dt className="font-semibold">Storage Engine</dt>
          <dd>
            Firebase Firestore is used for fast and scalable document-based
            storage.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Pagination</dt>
          <dd>
            Cursor-based infinite scrolling ensures performance even with a
            large dataset by fetching limited batches per scroll.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Media Delivery</dt>
          <dd>
            CDN-backed delivery via Firebase Storage + Google Cloud CDN caches
            content on edge servers worldwide.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Scalability</dt>
          <dd>
            Option to integrate Redis caching for trending content in future
            upgrades.
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default ScalabilityAndStorage;
