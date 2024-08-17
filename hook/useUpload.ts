import {textToSpeech} from "@/lib/tts";

export default function useUpload() {
    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            await fetch('/api/resume', {
                method: 'POST',
                body: formData,
            });
        } catch (err) {
            console.error(err);
            void textToSpeech("文件上传失败出了点问题，请检查后重试")
        }
    };

    return {
        handleUpload
    }
}
