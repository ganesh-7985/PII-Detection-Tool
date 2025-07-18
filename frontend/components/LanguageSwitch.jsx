import { useState } from "react";

export default function LanguageSwitch({ onSelect, detectedLanguages }) {
  const [selected, setSelected] = useState(detectedLanguages?.[0] || "en");

  const handleChange = (e) => {
    setSelected(e.target.value);
    onSelect([e.target.value]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-6">
      <h4 className="font-medium text-gray-900 dark:text-white">Language Selection</h4>
      <select value={selected} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="ml">Malayalam</option>
      </select>
    </div>
  );
}
