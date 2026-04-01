'use client';
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { useState } from "react";
import { Message } from "@/hooks/use-generation";

export default function TestPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = (text: string, file: File | null) => {
        setIsLoading(true);
        // fake request
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }

    return (
        <div className="h-screen bg-black p-8">
            <ChatInterface messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
        </div>
    );
}
