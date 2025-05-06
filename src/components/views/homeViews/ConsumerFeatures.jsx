import React from "react";

const ConsumerFeatures = () => {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Consumer Role Features</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Dedicated Consumer View to browse shared media.</li>
        <li>Real-time search via `/api/v1/media/search` endpoint.</li>
        <li>Ability to comment and like media posts.</li>
        <li>Restricted from uploading or modifying any content.</li>
      </ul>
    </section>
  );
};

export default ConsumerFeatures;
