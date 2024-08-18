"use client"

import 'regenerator-runtime/runtime'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {useCallback, useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import useInterview from "@/hook/useInterview";
import {useLottie} from "lottie-react";
import voiceAnimation from '@/public/voice.json'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function ChatWidget({ className} : {className?: string}) {
    const { messages, sendMsg, isPlaying, setIsPlaying } = useInterview();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(true)

    const {
        transcript,
        resetTranscript,
    } = useSpeechRecognition();

    const { View, play, stop } = useLottie({
        animationData: voiceAnimation,
        autoplay: false,
    })

    const handleRecoding = useCallback(async () => {
        if (isPlaying) return
        if (isPaused) {
            play()
            await SpeechRecognition.startListening({
                continuous: true
            })
        } else {
            await SpeechRecognition.stopListening()
            stop()
            setIsPlaying(true)
            await sendMsg(transcript)
            setTimeout(() => resetTranscript(), 100)
        }
        setIsPaused(!isPaused)

    }, [isPaused, isPlaying, play, resetTranscript, sendMsg, setIsPlaying, stop, transcript])

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
            <div className={cn("flex flex-col h-full justify-between bg-background overflow-auto", className)}>
                isPlaying: {
                    isPlaying.toString()
                }

                <div className="flex-1 overflow-auto p-4 pb-10 space-y-4">
                    {
                        messages.map(m => {
                            const isAi = m.role !== 'user'
                            return isAi ? <div key={m.id} className="flex items-start gap-4">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="/order-default-avatar.png" alt="Avatar"/>
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="bg-card p-3 rounded-lg max-w-[80%] text-card-foreground">
                                    <p>{m.content}</p>
                                </div>
                            </div> : <div key={m.id} className="flex items-start gap-4 justify-end">
                                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                                    <p>{m.content}</p>
                                </div>
                                <Avatar className="w-8 h-8 border">
                                    <AvatarImage src="/default-avatar.png" alt="Avatar"/>
                                    <AvatarFallback>You</AvatarFallback>
                                </Avatar>
                            </div>
                        })
                    }
                    <div ref={endOfMessagesRef}/>
                </div>
                <div className="bg-slate-800 p-4 flex items-center gap-2">
                    <div
                     className="flex flex-col w-full justify-center items-center  "
                    >
                        <div onClick={handleRecoding} className={cn(isPlaying ? 'cursor-not-allowed mix-blend-multiply' : 'cursor-pointer')}>{View}</div>
                        <p className="text-muted/80">{
                            isPlaying ? '请等待' : `点击${isPaused ? '开始' : '结束'}回答`
                        }</p>
                    </div>
                </div>
            </div>
        )
}
