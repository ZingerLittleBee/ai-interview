"use client"

import React, {useEffect, useRef, useState} from "react";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {toolbarPlugin} from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import {useInterviewStore} from "@/store";
import ChatWidget from "@/components/chat";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "./ui/tabs";
import {XCircleIcon} from "lucide-react";
import {cn} from "@/lib/utils";

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

  return (
    <div className={cn("flex flex-col md:flex-row h-screen p-4 bg-gray-100", isFullScreen && 'p-0')}>
      {/* Left side for videos */}
      <div className="md:w-2/3 w-full flex flex-col space-y-4">
        {/* Webcam Video */}
        <div className="bg-white p-4 rounded-lg shadow-md flex-1">
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
        <Tabs defaultValue="chat" className="flex flex-col h-full">
          <div className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">简历预览</TabsTrigger>
            <TabsTrigger value="chat">聊天信息</TabsTrigger>
          </TabsList></div>
          <TabsContent value="resume" className="overflow-auto">
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
          <TabsContent value="chat" className="flex-1">
            <ChatWidget className="rounded-lg" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WebcamInterviewPage;
