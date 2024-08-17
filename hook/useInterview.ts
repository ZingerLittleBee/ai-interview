import {useChat} from "ai/react";

export default function useInterview() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit
    }

}
