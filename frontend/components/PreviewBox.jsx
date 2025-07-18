import { useState } from "react";

export default function PreviewBox({ src, detections, originalDetections, flaggedCount }) {
  const [showDetections, setShowDetections] = useState(true);

  const getPiiTypeColor = (type) => {
    const colors = {
      EMAIL: "border-red-500 bg-red-500",
      PHONE: "border-yellow-500 bg-yellow-500",
      AADHAAR: "border-purple-500 bg-purple-500",
      DATE: "border-blue-500 bg-blue-500",
      NAME: "border-green-500 bg-green-500",
      ADDRESS: "border-orange-500 bg-orange-500",
      DOB: "border-indigo-500 bg-indigo-500",
    };
    return colors[type] || "border-gray-500 bg-gray-500";
  };

  const getPiiTypeStats = () => {
    const stats = {};
    detections.forEach((d) => {
      stats[d.type] = (stats[d.type] || 0) + 1;
    });
    return stats;
  };

  const stats = getPiiTypeStats();

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "masked_image.jpg";
    link.click();
  };

  const downloadMetadata = () => {
    const json = JSON.stringify(detections, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "detections.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Results</h3>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <button onClick={downloadImage} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Download Image</button>
            <button onClick={downloadMetadata} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Download Metadata</button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Show detections</span>
              <button
                onClick={() => setShowDetections(!showDetections)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showDetections ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showDetections ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{originalDetections}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Detections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{flaggedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Needs Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{originalDetections - flaggedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Auto Masked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{Object.keys(stats).length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">PII Types</div>
          </div>
        </div>
      </div>

      {/* PII Type Legend */}
      {Object.keys(stats).length > 0 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Detected PII Types</h4>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats).map(([type, count]) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getPiiTypeColor(type).split(" ")[1]}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      <div className="p-6">
        <div className="relative inline-block max-w-full mx-auto">
          <img src={src || "/placeholder.svg"} alt="Processed image with masked PII" className="max-w-full h-auto rounded-lg shadow-md" />
          {showDetections &&
            detections.map((d, i) => {
              const [x1, y1] = d.bbox[0];
              const [x2, y2] = d.bbox[2];
              const colorClass = getPiiTypeColor(d.type);
              return (
                <div key={i} className="absolute group">
                  <div
                    className={`border-2 ${colorClass.split(" ")[0]} bg-opacity-20 ${colorClass.split(" ")[1]} rounded`}
                    style={{ left: x1, top: y1, width: x2 - x1, height: y2 - y1 }}
                  />
                  <div className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {d.type} - {Math.round(d.confidence * 100)}%
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
