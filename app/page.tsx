"use client";

import { useState } from "react";
import InterviewLayout from "@/components/InterviewLayout";
import UploadViewLayout from "@/components/UploadViewLayout";
import { useInterviewStore } from "@/store";
import Image from "next/image";

export default function Home() {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { page } = useInterviewStore();
  return (
    <>
      {page === "upload" && <UploadViewLayout />}
      {page === "interview" && <InterviewLayout />}
      {page === "result" && <div>感谢参与面试，我们会在3天内联系您，请静候佳音</div>}
    </>
  );
}
