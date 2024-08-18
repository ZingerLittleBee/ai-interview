"use client";

import { useState } from "react";
import InterviewLayout from "@/components/InterviewLayout";
import UploadViewLayout from "@/components/UploadViewLayout";
import { useInterviewStore } from "@/store";

export default function Home() {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { page } = useInterviewStore();
  return (
    <>
      {page === "upload" && <UploadViewLayout />}
      {page === "interview" && <InterviewLayout />}
      {page === "result" && <div>result</div>}
    </>
  );
}
