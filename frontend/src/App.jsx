import { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import LanguageSwitch from "../components/LanguageSwitch";
import PreviewBox from "../components/PreviewBox";
import ReviewPanel from "../components/ReviewPanel";
import { getStatus, getResult, submitReview } from "../services/api";

export default function App() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState(["en"]);
  const [darkMode, setDarkMode] = useState(false);  // Modern dark mode toggle

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    const interval = setInterval(async () => {
      try {
        const resp = await getStatus(jobId);
        setStatus(resp.data.status);
        if (resp.data.status === "completed") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch (err) {
        setError("Status error");
        clearInterval(interval);
        setLoading(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    if (status === "completed") {
      getResult(jobId).then((r) => setResult(r.data)).catch(() => setError("Result error"));
    }
  }, [status]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleReview = async (decisions) => {
    await submitReview(jobId, decisions);
    alert("Submitted!");
  };

  const handleNewUpload = () => {
    setJobId(null); setStatus(null); setResult(null); setError(null);
  };

  const imgSrc = result ? `data:image/jpeg;base64,${result.image_base64}` : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PII Masking Tool</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className="text-gray-600 dark:text-gray-300">
              {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            {result && (
              <button onClick={handleNewUpload} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Upload
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
              <button onClick={handleNewUpload} className="ml-auto text-sm text-red-600 dark:text-red-300">Retry</button>
            </div>
          </div>
        )}

        {!jobId && <LanguageSwitch onSelect={setLanguages} detectedLanguages={languages} />}
        {!jobId && <ImageUpload onJob={setJobId} languages={languages} />}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
        {result && (
          <div className="space-y-8">
            <LanguageSwitch onSelect={setLanguages} detectedLanguages={result.languages} />
            <PreviewBox src={imgSrc} detections={result.detections} originalDetections={result.detections.length} flaggedCount={result.flagged.length} />
            {result.flagged.length > 0 && <ReviewPanel flagged={result.flagged} onSubmit={handleReview} />}
          </div>
        )}
      </main>
    </div>
  );
}
