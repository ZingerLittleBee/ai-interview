import { useState, useRef, useCallback } from 'react';
import {useInterviewStore} from "@/store";

const useTextToSpeech = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { setIsTts } = useInterviewStore()

    const textToSpeech = useCallback(async (prompt: string, id?: string) => {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        if (!response.ok) {
            throw new Error('网络错误，无法获取音频');
        }

        const data = await response.arrayBuffer();
        const audioBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // 创建新的 Audio 对象
        const newAudio = new Audio(audioUrl);
        audioRef.current = newAudio;

        newAudio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl); // 释放 blob URL
            setIsPlaying(false); // 更新播放状态
        });

        // 播放音频
        await newAudio.play();
        setIsPlaying(true); // 更新播放状态
        if (id) {
            setIsTts({
                id,
                convert: true
            })
        }
    }, [setIsTts]);

    // 播放音频
    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    // 暂停音频
    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return { textToSpeech, play, pause, isPlaying, setIsPlaying };
};

export default useTextToSpeech;
