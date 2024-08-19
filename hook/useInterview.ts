import { useChat } from "ai/react";
import useTextToSpeech from "@/hook/useTextToSpeech";

export default function useInterview() {

  const { textToSpeech, isPlaying, setIsPlaying } = useTextToSpeech()

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    onFinish: (message) => {
      textToSpeech(message.content);
    },
  });

  const sendMsg = async (content: string) =>
    append({
      id: Date.now().toString(),
      content,
      role: 'user'
    })

  const start = async () => sendMsg('开始面试')

  return {
    start,
    messages,
    sendMsg,
    input,
    handleInputChange,
    handleSubmit,
    isPlaying,
    setIsPlaying
  };
}
