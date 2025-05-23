import FormButton from "./FormButton";
import React, { useContext } from "react";
import { ResumeContext } from "../../pages/builder";
import AISuggestionButton from '../ai/AISuggestionButton';
import TextEditor from "./TextEditor";

const Projects = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);

  const handleProjects = (e, index) => {
    const newProjects = [...resumeData.projects];
    newProjects[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, projects: newProjects });
  };

  const addProjects = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          title: "",
          link: "",
          description: "",
          keyAchievements: "",
          startYear: "",
          endYear: "",
        },
      ],
    });
  };

  const removeProjects = (index) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = newProjects[newProjects.length - 1];
    newProjects.pop();
    setResumeData({ ...resumeData, projects: newProjects });
  };

  return (
    <div className="flex-col-gap-2">
      <h2 className="input-title">Projects</h2>
      {resumeData.projects?.map?.((project, index) => (
        <div key={index} className="f-col">
          <input
            type="text"
            placeholder="Project Name"
            name="name"
            className="w-full other-input"
            value={project.name}
            onChange={(e) => handleProjects(e, index)}
          />
          <input
            type="text"
            placeholder="Include https:// in the link"
            name="link"
            className="w-full other-input"
            value={project.link}
            onChange={(e) => handleProjects(e, index)}
          />
          <div className="flex justify-between items-center">
            <label>Description</label>
            <AISuggestionButton 
              section="project description" 
              content={project.description} 
            />
          </div>
          <TextEditor
            type="text"
            placeholder="Description"
            name="description"
            className="w-full other-input"
            value={project.description}
            maxLength="250"
            onChange={(e) => handleProjects(e, index)}
          />
          <div className="flex justify-between items-center">
            <label>Key Achievements</label>
            <AISuggestionButton 
              section="project achievements" 
              content={project.keyAchievements} 
            />
          </div>
          <textarea
            type="text"
            placeholder="Key Achievements"
            name="keyAchievements"
            className="w-full other-input"
            value={project.keyAchievements}
            onChange={(e) => handleProjects(e, index)}
          />
          <div className="flex-wrap-gap-2">
            <input
              type="date"
              placeholder="Start Year"
              name="startYear"
              className="other-input"
              value={project.startYear}
              onChange={(e) => handleProjects(e, index)}
            />
            <input
              type="date"
              placeholder="End Year"
              name="endYear"
              className="other-input"
              value={project.endYear}
              onChange={(e) => handleProjects(e, index)}
            />
          </div>
        </div>
      ))}
      <FormButton
        size={resumeData.projects.length}
        add={addProjects}
        remove={removeProjects}
      />
    </div>
  );
};

export default Projects;
