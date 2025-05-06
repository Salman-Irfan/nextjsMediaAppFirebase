import React from "react";

const MediaConversionInfo = () => (
  <div className="rounded border border-pink-300 dark:border-pink-600 p-6 bg-pink-50 dark:bg-pink-900 mb-8">
    <h2 className="text-xl md:text-2xl font-semibold text-pink-800 dark:text-pink-200 mb-2">
      Media Conversion & Limits
    </h2>
    <article className="text-sm text-pink-900 dark:text-pink-100 space-y-2">
      <p>
        <strong>Client-side image compression:</strong> Implemented via{" "}
        <code>browser-image-compression</code> to reduce file size before
        upload.
      </p>
      <p>
        Videos are uploaded directly to Firebase Storage due to limitations in
        browser-side processing.
      </p>
      <p>
        <strong>Firebase Storage rules:</strong> Applied to enforce upload
        size limits and ensure fair usage under the free-tier quota.
      </p>
    </article>
  </div>
);

export default MediaConversionInfo;
