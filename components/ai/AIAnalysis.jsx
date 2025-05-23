import React, { useState } from 'react';
import { analyzeResume } from '../../utils/gemini';
import { FaRobot, FaSpinner } from 'react-icons/fa';

const AIAnalysis = ({ resumeData }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeResume(resumeData);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleAnalyze}
        className="bg-zinc-800 text-white p-3 rounded-full hover:bg-zinc-700 transition-colors"
        disabled={loading}
      >
        {loading ? <FaSpinner className="animate-spin" /> : <FaRobot />}
      </button>
      
      {analysis && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white p-6 rounded-lg shadow-xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">AI Resume Analysis</h2>
          <div className="whitespace-pre-line">{analysis}</div>
          <button
            onClick={() => setAnalysis('')}
            className="mt-4 bg-zinc-800 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis; 