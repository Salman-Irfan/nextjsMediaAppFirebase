import React from "react";

const ScalabilityAndStorage = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Scalability & Storage</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          Firebase Firestore is used for fast and scalable document-based
          storage.
        </li>
        <li>
          Dynamic pagination using cursor-based infinite scrolling ensures the
          media feed remains performant — regardless of how many posts are in
          the database, only a limited batch is fetched per scroll event,
          reducing load and memory usage.
        </li>
        <li>
          CDN-backed media delivery guarantees fast image/video loading
          globally. All media is uploaded to Firebase Storage, which
          automatically integrates with Google Cloud CDN. This ensures files are
          cached on global edge servers and served from the nearest location to
          the user — significantly improving load times and performance without
          requiring additional configuration.
        </li>
      </ul>
    </section>
  );
};

export default ScalabilityAndStorage;
