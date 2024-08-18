import { textToSpeech } from "@/lib/tts";
import { useChat } from "ai/react";

export default function useInterview() {
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

  return {
    messages,
    sendMsg,
    input,
    handleInputChange,
    handleSubmit,
  };
}
