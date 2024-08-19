import { useChat } from "ai/react";
import useTextToSpeech from "@/hook/useTextToSpeech";
import {useInterviewStore} from "@/store";

export default function useInterview() {

  const { textToSpeech, isPlaying, setIsPlaying } = useTextToSpeech()
  const { setIsTts } = useInterviewStore()

  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    onFinish: (message) => {
      void textToSpeech(message.content, message.id);
      setIsTts({
        id: message.id,
        convert: false
      })
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
