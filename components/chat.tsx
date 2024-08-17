import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {SendIcon} from "lucide-react";
import {useEffect, useRef} from "react";
import {cn} from "@/lib/utils";
import useInterview from "@/hook/useInterview";

export default function ChatWidget({ className} : {className?: string}) {
    const { messages, input, handleInputChange, handleSubmit } = useInterview();
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
            <div className={cn("flex flex-col h-full justify-between bg-background overflow-auto", className)}>
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
                <div className="bg-muted p-4 flex items-center gap-2">
                    <Textarea
                        value={input}
                        placeholder="请输入你的答案"
                        className="flex-1 bg-background text-foreground max-h-[300px]"
                        onChange={handleInputChange}
                    />
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50"
                    onClick={handleSubmit}
                    >
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        )
}
