import React from "react";
import ContactInfo from "./ContactInfo";
import Link from "next/link";
import { FaExternalLinkAlt, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Certification from "./Certification";
import DateRange from "../utility/DateRange";
import { formatDate, LineList, sanitizeQuillHtml } from "../../utils/gemini";

const TemplateTwo = ({ 
  namedata, 
  positionData, 
  contactData, 
  emailData, 
  addressData, 
  telIcon, 
  emailIcon, 
  addressIcon,
  summaryData,
  educationData,
  projectsData,
  workExperienceData,
  skillsData,
  languagesData,
  certificationsData,
  sectionOrder,
  onDragEnd,
  resumeData,
  setResumeData
}) => {

  const sections = [
    { id: "summary", title: "Summary", content: summaryData },
    { id: "education", title: "Education", content: educationData },
    { id: "projects", title: "Projects", content: projectsData },
    { id: "experience", title: "Work Experience", content: workExperienceData },
    { id: "skills", title: "Technical Skills", content: skillsData },
    { id: "softskills", title: "Soft Skills", content: skillsData.find(skill => skill?.title === "Soft Skills")?.skills || [] },
    { id: "languages", title: "Languages", content: languagesData },
    { id: "certifications", title: "Certifications", content: certificationsData }
  ];

  const orderedSections = sectionOrder
    ?.map?.(id => sections.find(section => section.id === id))
    .filter(section => section !== undefined);

  const renderSection = (section) => {
    switch(section.id) {
      case "certifications":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Certifications</h2>
            <ul className="list-disc pl-4 content">
              {certificationsData && certificationsData?.map?.((cert, i) => (
                <li key={i} className="content">
                  {cert.name}
                  {cert.issuer && (
                    <span className="text-gray-600"> - {cert.issuer}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case "summary":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Summary</h2>
            <p className="content ql-editors p-0" >{sanitizeQuillHtml(summaryData)}</p>
          </div>
        );
      case "education":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Education</h2>
            {educationData?.map?.((edu, idx) => (
              <div key={idx} className="mb-1">
                <div className="content flex justify-between items-center">
                  <p className="font-semibold mb-0">{edu.school}</p>
                    <DateRange
                      startYear={edu.startYear}
                      endYear={edu.endYear}
                      id={`education-start-end-date`}
                    />
                </div>
                <p className="content">{edu.degree}</p>
              </div>
            ))}
          </div>
        );
      case "projects":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Projects</h2>
            <Droppable droppableId="projects" type="PROJECTS">
              {(provided) => (
                <div {...provided?.droppableProps} ref={provided?.innerRef}>
                  {projectsData?.map?.((project, idx) => (
                    <Draggable key={project?.name + idx} draggableId={`project-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided?.innerRef}
                          {...provided?.draggableProps}
                          {...provided?.dragHandleProps}
                          className={`mb-2 ${snapshot?.isDragging ? "bg-gray-50" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <p className="content i-bold">{project?.name}</p>
                              {project?.link && (
                                <Link
                                  href={project?.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                  title={project?.link}
                                >
                                  <FaExternalLinkAlt size={12} />
                                </Link>
                              )}
                            </div>
                           {project?.startYear && project?.endYear && (
                             <p className="sub-content font-medium text-gray-600">
                              {new Date(project?.startYear).getFullYear()} - {new Date(project?.endYear).getFullYear()}
                            </p>
                           )}
                          </div>
                          {project?.description && <p className="content ql-editors p-0" >
                            {sanitizeQuillHtml(project?.description)}
                          </p>}
                          {project?.keyAchievements &&
                            <LineList list={project?.keyAchievements}/>
                          }
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided?.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      case "experience":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Work Experience</h2>
            <Droppable droppableId="work-experience" type="WORK_EXPERIENCE">
              {(provided) => (
                <div {...provided?.droppableProps} ref={provided?.innerRef}>
                  {workExperienceData?.map?.((work, idx) => (
                    <Draggable key={work?.company + idx} draggableId={`work-${idx}`} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided?.innerRef}
                          {...provided?.draggableProps}
                          {...provided?.dragHandleProps}
                          className={`mb-2 ${snapshot?.isDragging ? "bg-gray-50" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <p className="content">
                              <span className="content fw-6">{work?.position}</span>
                            </p>
                            <p className="sub-content font-medium text-gray-600">
                              {`${formatDate(work?.startYear)}`} - {work?.endYear ? formatDate(work?.endYear):"Present"}
                            </p>
                          </div>
                          <span className="content fw-6">{work?.company}</span>
                          {work?.keyAchievements &&
                            <LineList list={work?.keyAchievements}/>
                          }
                          {work?.description && <p className="content ql-editors p-0" >
                            {sanitizeQuillHtml(work?.description)}
                          </p>}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided?.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      case "skills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Technical Skills</h2>
            <p className="content">
              {skillsData.find(skill => skill?.title === "Technical Skills")?.skills.join(", ")}
            </p>
          </div>
        );
      case "softskills":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Soft Skills</h2>
            <p className="content">
              {section.content.join(", ")}
            </p>
          </div>
        );
      case "languages":
        return (
          <div>
            <h2 className="section-title border-b-2 border-gray-300 mb-1">Languages</h2>
            <p className="content">
              {section.content.join(", ")}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const icons = [
    { name: "github", icon: <FaGithub /> },
    { name: "linkedin", icon: <FaLinkedin /> },
    { name: "twitter", icon: <FaTwitter /> },
    { name: "facebook", icon: <FaFacebook /> },
    { name: "instagram", icon: <FaInstagram /> },
    { name: "youtube", icon: <FaYoutube /> },
    { name: "website", icon: <CgWebsite /> },
  ];

  // Function to extract username from URL
  const getUsername = (url) => {
    return url.split('/').pop();
  };

  if (certificationsData) {
    console.log("Certifications data exists:", certificationsData);
    console.log("Section order includes certifications:", sectionOrder.includes("certifications"));
    console.log("Ordered sections:", orderedSections);
  }
  const StaticTemplateTwo = ({ orderedSections }) => (
    <div className="w-full h-full bg-white p-4">
      {orderedSections.map((section, index) => (
        <div key={section.id} className="mb-2">
          {/* Direct render, not draggable */}
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
  return (
    <div className="w-full h-full bg-white p-4">
      {/* Header Section */}
      <div className="text-center mb-2">
        <h1 className="name">{namedata}</h1>
        <p className="profession">{positionData}</p>
        <ContactInfo
          mainclass="flex flex-row gap-1 contact justify-center"
          linkclass="inline-flex items-center gap-1"
          teldata={contactData}
          emailData={emailData}
          addressData={addressData}
          telIcon={telIcon}
          emailIcon={emailIcon}
          addressIcon={addressIcon}
        />
        <div className="flex justify-center items-center gap-2 mt-1 text-sm">
          {resumeData.socialMedia?.map?.((socialMedia, index) => {
            return (
              <a
                href={`http://${socialMedia.link}`}
                aria-label={socialMedia.socialMedia}
                key={index}
                title={socialMedia.socialMedia}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-[2px] text-blue-600 hover:text-blue-800 transition-colors"
              >
                {icons?.map?.((icon, index) => {
                  if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                    return <span key={index} className="text-sm">{icon.icon}</span>;
                  }
                })}
                {getUsername(socialMedia.link)}
              </a>
            );
          })}
        </div>
      </div>
      {/* Draggable Sections */}
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div {...provided?.droppableProps} ref={provided?.innerRef}>
              {orderedSections?.map?.((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided?.innerRef}
                      {...provided?.draggableProps}
                      {...provided?.dragHandleProps}
                      className={`mb-2 ${snapshot?.isDragging ? "bg-gray-50" : ""}`}
                    >
                      {renderSection(section)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided?.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TemplateTwo;