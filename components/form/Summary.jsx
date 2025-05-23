import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import AISuggestionButton from '../ai/AISuggestionButton';
import { Editor } from 'primereact/editor';
import TextEditor from "./TextEditor";


const Summary = () => {
  const { resumeData, handleChange } = useContext(ResumeContext);

  return (
    <div className="flex-col-gap-2">
      <div className="flex justify-between items-center">
        <h2 className="input-title">Summary</h2>
        <AISuggestionButton 
          section="summary" 
          content={resumeData.summary} 
        />
      </div>
      <div className="row">
        <TextEditor
          placeholder="Summary"
          name="summary"
          className="w-full other-input "
          value={resumeData.summary}
          onChange={handleChange}
          maxLength="500"
        />
        {/* <Editor value={resumeData.summary} onTextChange={console.log} style={{ height: '320px' }} /> */}

      </div>
    </div>
  );
};

export default Summary;
