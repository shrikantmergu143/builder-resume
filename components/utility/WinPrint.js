import { MdPictureAsPdf } from "react-icons/md";
import { generateAndDownloadPdf, getCertificatePDF } from "../../utils/gemini";

const WinPrint = () => {
  const print = async  () => {
    // window.print();
    await getCertificatePDF("preview_pdf")
  };

  return (
    <button
      aria-label="Download Resume"
      className="exclude-print fixed bottom-5 right-10 font-bold rounded-full bg-white text-zinc-800 shadow-lg border-2 border-white"
      onClick={print}
    >
      <MdPictureAsPdf className="w-10 h-10" title="Download Resume" />
    </button>
  );
};

export default WinPrint;
