import React from "react";

const ConsumerFeatures = () => {
  return (
    <aside className="bg-blue-50 dark:bg-gray-800 p-6 rounded-md border-l-4 border-blue-400 mb-8">
    <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Consumer Role Features</h2>
    <div className="text-gray-800 dark:text-gray-200">
      <p>Consumer users enjoy:</p>
      <ul className="mt-2 pl-4 list-disc space-y-1">
        <li>Dedicated Consumer View to browse shared media.</li>
        <li>Real-time search via <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/api/v1/media/search</code> endpoint.</li>
        <li>Ability to comment and like media posts.</li>
        <li>Restricted from uploading or modifying any content.</li>
      </ul>
    </div>
  </aside>
  );
};

export default ConsumerFeatures;
