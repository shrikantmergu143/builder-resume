import React, { useState } from 'react';
import { FaLightbulb, FaSpinner } from 'react-icons/fa';
import { getSuggestions } from '../../utils/gemini';

const AISuggestionButton = ({ section, content }) => {
  const [suggestions, setSuggestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          content
        }),
      });
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-col-gap-2 mb-4">
      <div className="flex justify-end">
        <button
          onClick={handleGetSuggestions}
          className="bg-zinc-800 text-white p-2 rounded hover:bg-zinc-700 transition-colors"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaLightbulb />}
        </button>
      </div>
      
      {suggestions && (
        <div className="bg-zinc-100 p-4 rounded mt-2 -ml-20 shadow-md">
          <h3 className="text-zinc-800 font-semibold mb-2 text-left">AI Suggestions:</h3>
          <div className="text-zinc-700 whitespace-pre-line">{suggestions}</div>
          <button
            onClick={() => setSuggestions('')}
            className="mt-2 bg-zinc-800 text-white px-3 py-1 rounded hover:bg-zinc-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AISuggestionButton; 