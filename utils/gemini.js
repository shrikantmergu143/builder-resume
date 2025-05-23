import parse from 'html-react-parser';
import React from 'react';

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API version v1
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeResume(resumeData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze this resume data and provide feedback on:
  1. Overall strength and weaknesses
  2. ATS optimization suggestions
  3. Content improvement recommendations
  
  Resume Data:
  ${JSON.stringify(resumeData, null, 2)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return "Error analyzing resume. Please try again.";
  }
}

export async function getSuggestions(section, currentContent) {
  // Check for API key first
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API_ERROR: Missing or invalid Gemini API key");
  }

  // Validate content
  if (!currentContent || currentContent.trim() === "") {
    throw new Error(
      "CONTENT_ERROR: Please write something first to get suggestions"
    );
  }

  // Check for minimum content length
  if (currentContent.trim().length < 10) {
    throw new Error(
      "CONTENT_ERROR: Please write at least a few words to get meaningful suggestions"
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a friendly resume writing assistant. Look at this ${section} content and suggest 2 slightly improved versions. 
    Keep the same meaning and information, but make it flow better. Use natural, conversational language - no complex jargon.
    Make it sound like a real person wrote it.

    Important guidelines:
    - Keep the same key points and achievements
    - Use simple, clear language
    - Make it sound natural and conversational
    - Keep a similar length
    - Don't add new information
    
    Current content:
    ${currentContent}

    Format your response as:
    Option 1:
    [first natural improvement]

    Option 2:
    [second natural improvement]`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific API errors
    if (error.message?.includes("quota")) {
      throw new Error(
        "QUOTA_ERROR: API quota exceeded. Please try again later"
      );
    }
    if (error.message?.includes("invalid")) {
      throw new Error("API_ERROR: Invalid API key");
    }
    if (error.message?.includes("rate")) {
      throw new Error("RATE_ERROR: Too many requests. Please wait a moment");
    }

    // Generic error fallback
    throw new Error(
      `API_ERROR: ${error.message || "Failed to generate suggestions"}`
    );
  }
}

export function formatDate(dateTime) {
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const date = new Date(dateTime);
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month}/${year}`;
}
const generateHtmlContent = (content, styles) => {
  const fallbackStyles = `
    .ql-editors, .ql-editor {
      font-size: 14px;
      line-height: 1.5;
      padding: 0 !important;
    }

    .ql-editors ul, .ql-editors ol,
    .ql-editor ul, .ql-editor ol {
      list-style-type: disc;
      padding-left: 1.5em;
      margin: 0 0 1em 0;
    }

    .ql-editors li, .ql-editor li {
      list-style-type: disc;
      display: list-item;
      margin-bottom: 4px;
    }

    .ql-ui, .ql-editors .ql-ui, .ql-editor .ql-ui {
      display: none !important;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .ql-editor, .ql-editors {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `;

  return `
    <html>
      <head>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Katibeh&display=swap");
          ${styles}
          ${fallbackStyles}
        </style>
      </head>
      <body>${content}</body>
    </html>
  `;
};


export const getCertificatePDF = async (course_id, state) => {
  const componentRef = document.getElementById(course_id);

  const styles = Array.from(document.styleSheets)
    .map((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch (e) {
        console.warn("Cannot read cssRules from stylesheet:", e);
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");

  const htmlContent = generateHtmlContent(componentRef.innerHTML, styles);
  const pdfBlob = await generatePdf(htmlContent);
  console.log("pdfBlob", pdfBlob);
  if (state) {
    return pdfBlob;
  }
  const url = window.URL.createObjectURL(pdfBlob);
  window.open(url);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Certificate-.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};
const generatePdf = async (htmlContent) => {
  // Generate PDF from HTML content
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ htmlContent }),
  });
  return await response.blob();
};

export const generateAndDownloadPdf = async (ids) => {
  try {
    const fallbackStyles = `
    .ql-editor, .ql-editors {
      font-size: 14px;
      line-height: 1.5;
      padding: 0 !important;
    }

    .ql-editor ul, .ql-editor ol,
    .ql-editors ul, .ql-editors ol {
      list-style-type: disc;
      padding-left: 20px;
      margin: 0 0 1em 0;
    }

    .ql-editor li, .ql-editors li {
      list-style-type: disc;
      display: list-item;
      margin-bottom: 4px;
    }

    .ql-editor p, .ql-editors p {
      margin: 0 0 10px;
    }
  `;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.warn("Cannot read cssRules from stylesheet:", e);
          return "";
        }
      })
      .filter(Boolean)
      .join("\n");
    const componentRef = document.getElementById(`${ids}`);
    const htmlContent = `<html><style>@media print {
            #content, #content_image{padding-top: 0px!important;padding-bottom: 0px!important;}
            body{
              -webkit-print-color-adjust:exact !important;print-color-adjust:exact !important;
            }
              .d-none-print{display:none;}
               .ql-editors, .ql-editors p, .ql-editors ul, .ql-editors div {
            page-break-inside: avoid;
            break-inside: avoid;
          }
            @page {size: A4;margin: 0;padding: 0px;display: block;}
          }
            @page {size: A4;margin: 0;padding: 0px;display: block;}
            
            ${styles}
            ${fallbackStyles}
            </style><body className="light"><div className="${ids}"><div className="resume-page">${componentRef.innerHTML}</div></div></body></html>`;
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ htmlContent }),
    });
    const pdfBlob = await response.blob();
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export function sanitizeQuillHtml(html) {
return <p dangerouslySetInnerHTML={{__html: html}} />
}
export function LineList(props){
  console.log("props?.list", props?.list)
  return(
    <ul className="list-disc pl-4 content">
      {typeof props?.list === "string" &&
        props?.list?.split?.("\n")
          ?.map?.((achievement, subIndex) => (
            <React.Fragment key={subIndex}>
              <li>{achievement}</li>
            </React.Fragment>
      ))}
    </ul>
  )
}