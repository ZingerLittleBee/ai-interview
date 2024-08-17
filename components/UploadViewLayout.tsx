import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { useInterviewStore } from "@/store";

const UploadViewLayout = () => {
  const { setFileUrl, setPage } = useInterviewStore();
  const uploadRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const blob = new Blob([typedArray], { type: "application/pdf" });
        setFileUrl(URL.createObjectURL(blob));
        // todo 需要生成10个问题
        setPage("interview");
      };
      fileReader.readAsArrayBuffer(file);
    }
  };
  return (
    <>
      <div className="w-full h-auto min-h-screen flex flex-col justify-center items-center space-y-16">
        <div className="text-3xl font-semibold">请上传你的简历</div>
        <div
          className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] h-[200px] justify-center place-items-center flex flex-col space-y-2 cursor-pointer"
          onClick={() => {
            uploadRef.current?.click();
          }}
        >
          <CloudUpload />
          <div className="text-sm">仅支持PDF</div>
        </div>
      </div>
      <input
        ref={uploadRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadViewLayout;
