
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface BusinessCardExporterProps {
  cardName: string;
  cardRef: React.RefObject<HTMLDivElement>;
}

const BusinessCardExporter = ({ cardName, cardRef }: BusinessCardExporterProps) => {
  const exportAsImage = async () => {
    try {
      if (!cardRef.current) {
        toast.error("Could not find card to export");
        return;
      }

      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;
      
      toast("Preparing your business card...");
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      // Create a download link
      const link = document.createElement("a");
      link.download = `${cardName.replace(/\s+/g, "-").toLowerCase()}-business-card.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Business card exported successfully!");
    } catch (error) {
      console.error("Error exporting card:", error);
      toast.error("Failed to export card. Please try again.");
    }
  };

  const exportAsPDF = async () => {
    try {
      if (!cardRef.current) {
        toast.error("Could not find card to export");
        return;
      }

      // Import required libraries dynamically
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      
      toast("Preparing your business card PDF...");
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      // Standard business card size is 3.5 x 2 inches
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [3.5, 2]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, 3.5, 2);
      pdf.save(`${cardName.replace(/\s+/g, "-").toLowerCase()}-business-card.pdf`);
      
      toast.success("Business card PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting card as PDF:", error);
      toast.error("Failed to export card as PDF. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={exportAsImage}
        className="flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" /> Export as PNG
      </Button>
      <Button 
        variant="outline"
        onClick={exportAsPDF}
        className="flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" /> Export as PDF
      </Button>
    </div>
  );
};

export default BusinessCardExporter;
