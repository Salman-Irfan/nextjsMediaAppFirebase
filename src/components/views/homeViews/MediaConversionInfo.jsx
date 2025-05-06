import React from "react";

const MediaConversionInfo = () => (
  <section className="py-12 px-6 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">🎞️ Media Conversion & Limits</h2>
    <ul className="list-disc ml-6 space-y-2">
      <li>
        <strong>Client-side image compression</strong> is implemented using the <code>browser-image-compression</code> library to reduce upload size and stay within Firebase free-tier limits.
      </li>
      <li>
        <strong>Video files are uploaded as-is</strong> without compression, since client-side compression is inefficient, slow, and not natively supported in browsers.
      </li>
      <li>
        <strong>Firebase Storage rules</strong> are enforced to prevent excessive bandwidth or storage usage that would exceed the free-tier quota.
      </li>
    </ul>
  </section>
);

export default MediaConversionInfo;
