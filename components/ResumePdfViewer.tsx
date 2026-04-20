"use client";

import { useMemo, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { XCircleIcon } from "lucide-react";

type ResumePdfViewerProps = {
  fileUrl: string;
};

export default function ResumePdfViewer({ fileUrl }: ResumePdfViewerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toolbarPluginInstance = useMemo(() => toolbarPlugin(), []);

  return (
    <div
      className={`${
        isFullScreen ? "fixed inset-0 z-50" : "relative my-4"
      } bg-opacity-75 flex items-center justify-center overflow-auto`}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
        <div
          className="h-full w-full"
          onClick={() => {
            setIsFullScreen((value) => !value);
          }}
        >
          <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
        </div>
      </Worker>

      {isFullScreen && (
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute top-4 right-4 bg-white text-black rounded-full shadow-lg"
        >
          <XCircleIcon />
        </button>
      )}
    </div>
  );
}
