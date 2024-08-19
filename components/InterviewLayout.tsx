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
import Image from 'next/image'
import {Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {XCircleIcon} from "lucide-react";

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
      <div className="h-screen pt-[78px] flex flex-col md:flex-row bg-muted p-4">
        {/* Left side for videos */}
        <div className="md:w-2/3 w-full flex flex-col rounded-lg shadow-md overflow-hidden">
          {/* Webcam Video */}
          <div className="bg-white p-4">面试进行中，加油哦～ </div>
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
        <div className="md:w-1/3 w-full mt-4 md:mt-0 md:ml-4 bg-white rounded-lg h-full shadow-md flex flex-col">
          <Tabs value={tab} onValueChange={(v) => {setTab(v as "resume" | "chat")}} defaultValue="chat" className="flex flex-col h-full">
            <div className="p-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resume" className="flex gap-1">
                  <Image src={ResumeSvg} width={20} height={20} alt=""/>
                  <span>简历预览</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex gap-1">
                  <Image src={ChatSvg} width={20} height={20} alt="" />
                  <span>聊天信息</span>
                </TabsTrigger>
              </TabsList></div>
            <TabsContent forceMount hidden={tab !== 'resume'} value="resume" className="overflow-auto rounded-lg">
              {fileUrl && (
                  <div className={`${
                      isFullScreen ? "fixed inset-0 z-50" : "relative my-4"
                  } bg-opacity-75 flex items-center justify-center overflow-auto`}
                  >
                    <Worker
                        workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}
                    >
                      <div
                          className="h-full w-full"
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
                            className="absolute top-4 right-4 bg-white text-black rounded-full shadow-lg"
                        >
                          <XCircleIcon />
                        </button>
                    )}
                  </div>
              )}
            </TabsContent>
            <TabsContent forceMount hidden={tab !== 'chat'} value="chat" className="flex-1">
              {ResumeWidget}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default WebcamInterviewPage;
