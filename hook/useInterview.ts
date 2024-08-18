import { textToSpeech } from "@/lib/tts";
import { useChat } from "ai/react";

export default function useInterview() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: (message) => {
      textToSpeech(message.content);
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };
}
