'use client'

import { useRef } from "react";
import { CloudUpload } from "lucide-react";
import { useInterviewStore } from "@/store";
import { textToSpeech } from "@/lib/tts";
import useUpload from "@/hook/useUpload";

const UploadViewLayout = () => {
  const { setFileUrl, setPage } = useInterviewStore();
  const { handleUpload } = useUpload();

    const uploadRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
        void textToSpeech("您似乎没有上传简历，请检查后重试")
        return;
    }
    await handleUpload(event.target.files?.[0]);
    await textToSpeech("简历上传成功，请稍等片刻，面试即将开始")
      setTimeout(() => {
        setPage('interview')
      }, 1000)
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

        <div
          onClick={() => {
              textToSpeech("你好，我是面试官，请你自我介绍一下");
          }}
        >
          test tts
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
