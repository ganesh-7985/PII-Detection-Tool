import { useState } from "react";

export default function ReviewPanel({ flagged, onSubmit }) {
  const [decisions, setDecisions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDecision = (idx, keep) => {
    setDecisions((prev) => ({ ...prev, [idx]: keep }));
  };

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(decisions);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPiiTypeColor = (type) => {
    const colors = {
      EMAIL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      PHONE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      AADHAAR: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      DATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      NAME: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      ADDRESS: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      DOB: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const decidedCount = Object.keys(decisions).length;
  const totalCount = flagged.length;

  if (submitted) {
    return <div className="p-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">Review submitted successfully!</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900 border-b border-amber-200 dark:border-amber-700">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Manual Review Required</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">{totalCount} items need review</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{decidedCount} of {totalCount}</span>
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(decidedCount / totalCount) * 100}%` }}></div>
          </div>
        </div>

        <div className="space-y-4">
          {flagged.map((f, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPiiTypeColor(f.type)}`}>
                      {f.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Confidence: {Math.round(f.confidence * 100)}%</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-3">
                    <p className="text-lg font-mono text-gray-900 dark:text-white">"{f.text}"</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Should this be masked as {f.type}?</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleDecision(i, true)}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                    decisions[i] === true ? "border-green-500 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-800 hover:border-green-300 dark:hover:border-green-500"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Yes, Mask It
                </button>
                <button
                  onClick={() => handleDecision(i, false)}
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
                    decisions[i] === false ? "border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-800 hover:border-red-300 dark:hover:border-red-500"
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  No, Keep It
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={submit}
            disabled={decidedCount < totalCount || isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Review ({decidedCount}/{totalCount})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
