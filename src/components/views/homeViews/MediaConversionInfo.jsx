import React from "react";

const MediaConversionInfo = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Media Conversion & Limits</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          Images and videos are uploaded directly in original formats via
          Firebase Storage.
        </li>
        <li>
          Firebase Storage usage is within free-tier limits, monitored via rules
          and cautious upload limits.
        </li>
      </ul>
    </section>
  );
};

export default MediaConversionInfo;
