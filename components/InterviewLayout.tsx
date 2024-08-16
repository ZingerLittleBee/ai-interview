import React, { useRef, useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

enum MessageType {
    'AIMessage',
    'HumanMessage'
}
const mockMessages = [
    {
        type: MessageType.HumanMessage,
        text: '您好'
    }, {
        type: MessageType.AIMessage,
        text: '你好，请简短介绍一下你自己'
    }, {
        type: MessageType.HumanMessage,
        text: '好的，我的名字是XXXXX..........'
    }, {
        type: MessageType.AIMessage,
        text: '你的简历中写到XXXX请问XXXX你的简历中写到XXXX请问XXXX你的简历中写到XXXX请问XXXX你的简历中写到XXXX请问XXXX你的简历中写到XXXX请问XXXX'
    }
]
const WebcamInterviewPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const toolbarPluginInstance = toolbarPlugin();
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
                const blob = new Blob([typedArray], { type: 'application/pdf' });
                setFileUrl(URL.createObjectURL(blob));
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

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
        <div className="flex flex-col md:flex-row h-screen p-4 bg-gray-100">

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

                {/* Placeholder for additional video content */}
                <div className="bg-white p-4 rounded-lg shadow-md flex-1 overflow-scroll">
                    <div className="flex flex-col space-y-2">
                        {mockMessages.map((item, i) => {
                            const isAi = item.type === MessageType.AIMessage
                            return <div key={i}>
                                <p className={`font-bold  ${isAi ? 'text-blue-400' : 'text-yellow-400'}`}>{isAi ? '面试官：' : '面试者：'}</p>
                                <p className="text-gray-700">
                                    {item.text}
                                </p>
                            </div>
                        })}
                    </div>
                </div>
            </div>

            {/* Right side for transcription */}
            <div className="md:w-1/3 w-full mt-4 md:mt-0 md:ml-4 bg-white p-4 rounded-lg shadow-md flex flex-col">
                <div className='w-full h-full'>
                    简历预览
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    {fileUrl && (
                        <div
                            className={`${isFullScreen ? 'fixed inset-0 z-50' : 'relative'
                                } bg-black bg-opacity-75 flex items-center justify-center h-[90%] overflow-scroll`}
                        >
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}>
                                <div className={`${isFullScreen ? 'h-screen w-screen' : 'h-full w-full'}`} onClick={() => {
                                    setIsFullScreen((v) => !v)
                                }}>
                                    <Viewer fileUrl={fileUrl} plugins={[toolbarPluginInstance]} />
                                </div>
                            </Worker>

                            {isFullScreen && (
                                <button
                                    onClick={() => setIsFullScreen(false)}
                                    className="absolute top-4 right-4 bg-white text-black rounded-full p-2 shadow-lg"
                                >
                                    x
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default WebcamInterviewPage;
