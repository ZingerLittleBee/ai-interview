"use client";

import { useRef } from "react";
import { UploadIcon } from "lucide-react";
import { useInterviewStore } from "@/store";
import { textToSpeech } from "@/lib/tts";
import useUpload from "@/hook/useUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const UploadViewLayout = () => {
  const { setFileUrl, setPage } = useInterviewStore();
  const { handleUpload } = useUpload();

  const uploadRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) {
      void textToSpeech("您似乎没有上传简历，请检查后重试");
      return;
    }
    const file = event.target.files?.[0];
    await handleUpload(file);
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        const blob = new Blob([typedArray], { type: "application/pdf" });
        setFileUrl(URL.createObjectURL(blob));
      };
      fileReader.readAsArrayBuffer(file);
    }

    await textToSpeech("简历上传成功，请稍等片刻，面试即将开始");
    setTimeout(() => {
      setPage("interview");
    }, 1000);
  };
  return (
    <>
      <div className="relative w-full h-auto min-h-screen flex flex-col justify-center items-center space-y-16 z-50">
        <h1 className="text-4xl font-bold">随时随地，轻松开始面试</h1>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>请上传你的简历</CardTitle>
            <CardDescription>单击选择 PDF 文件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div
                className="cursor-pointer flex h-40 items-center justify-center rounded-md border border-dashed bg-muted transition-colors hover:border-primary hover:bg-muted-foreground/10"
                onClick={() => {
                  uploadRef.current?.click();
                }}
              >
                <div className="mx-auto flex flex-col items-center space-y-2 text-center">
                  <UploadIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-muted-foreground">
                    点击上传
                  </p>
                  <p className="text-xs text-muted-foreground">仅支持PDF</p>
                  <Input
                    ref={uploadRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="absolute top-0 left-0 right-0 h-[72px] flex items-center justify-center">
        <div className="w-full h-11 flex items-center px-6">
          <div className="h-7 flex items-center space-x-2">
            <Image
              src="/favicon-192.png"
              width={28}
              height={28}
              alt="interview"
            />
            <div className="text-[18px] font-semibold">Ai 面试官</div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-16 h-screen w-[254px] flex justify-center items-center px-6">
        <div className="relative w-full h-[311px]">
          <span className="eye"></span>
          <span className="eye !ml-2"></span>
          <Image src="/interview.png" fill alt="interview" />
        </div>
      </div>
    </>
  );
};

export default UploadViewLayout;

//     <div className="text-3xl font-semibold">请上传你的简历</div>
//     <div
//       className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px] h-[200px] justify-center place-items-center flex flex-col space-y-2 cursor-pointer"
//       onClick={() => {
//         uploadRef.current?.click();
//       }}
//     >
//       <CloudUpload />
//       <div className="text-sm">仅支持PDF</div>
//     </div>
//   </div>
//   <input
//     ref={uploadRef}
//     type="file"
//     accept="application/pdf"
//     className="hidden"
//     onChange={handleFileChange}
//   />
// </>
