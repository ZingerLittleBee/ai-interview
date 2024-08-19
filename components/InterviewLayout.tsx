"use client"

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { useInterviewStore } from "@/store";
import ChatWidget from "@/components/chat";
import ChatSvg from "@/public/chat.svg";
import ResumeSvg from "@/public/resume.svg";
import { cn } from "@/lib/utils";
import Image from 'next/image'
import { twMerge } from "tailwind-merge";

const WebcamInterviewPage = () => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const { fileUrl } = useInterviewStore();
  const toolbarPluginInstance = toolbarPlugin();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [tab, setTab] = useState<"resume" | "chat">("resume");


  useEffect(() => {
    // Request access to the webcam
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the webcam: ", err);
      }
    };

    getVideo();

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const ResumeWidget = useMemo(() => <ChatWidget className="rounded-lg" />, [])

  return (
    <>
      <div className="absolute top-0 left-0 right-0 h-[62px] flex items-center justify-center bg-white">
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
      <div className="h-screen pt-[62px] flex flex-col md:flex-row ">
        {/* Left side for videos */}
        <div className="md:w-2/3 w-full flex flex-col ">
          {/* Webcam Video */}
          <div className="bg-white px-4">面试进行中，加油哦～ </div>
          <div className="bg-white p-4 shadow-md flex-1">
            <div className="relative pb-9/16 h-full">
              <video
                ref={videoRef}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right side for transcription */}
        <div className="md:w-1/3 w-full mt-4 md:mt-0  bg-white shadow-md flex flex-col">
          <div className="flex items-center justify-center gap-2 absolute right-0 top-2 flex-col">
            <div onClick={() => setTab("resume")} className={
              twMerge("cursor-pointer hover:opacity-100 transition-all",
                tab !== 'resume' && ' opacity-45'
              )}>
              <Image src={ResumeSvg} width={26} height={26} alt="" />
            </div>
            <div onClick={() => setTab("chat")} className={
              twMerge("cursor-pointer hover:opacity-100 transition-all",
                tab !== 'chat' && ' opacity-45'
              )}>
              <Image src={ChatSvg} width={24} height={24} alt="" />
            </div>
          </div>
          {tab === "resume" && (
            <div className="w-full h-full">
              {fileUrl && (
                <div
                  className={`${isFullScreen ? "fixed inset-0 z-50" : "relative"
                    } bg-black bg-opacity-75 flex items-center justify-center h-full overflow-auto`}
                >
                  <Worker
                    workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}
                  >
                    <div
                      className={`${isFullScreen ? "h-screen w-screen" : "h-full w-full cursor-pointer"}`}
                      onClick={() => {
                        setIsFullScreen((v) => !v);
                      }}
                    >
                      <Viewer
                        fileUrl={fileUrl}
                        plugins={[toolbarPluginInstance]}
                      />
                    </div>
                  </Worker>

                  {isFullScreen && (
                    <button
                      onClick={() => setIsFullScreen(false)}
                      className="absolute top-4 right-4 bg-gray-400 text-black rounded-full flex items-center justify-center shadow-lg w-[24px] h-[24px]"
                    >
                      x
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          <ChatWidget className={
            cn(tab === 'chat' ? 'flex' : 'hidden')
          } />
        </div>
      </div>
    </>
  );
};

export default WebcamInterviewPage;
