"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sendMessage } from "./actions";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
    id: string;
}

export function AgentClient() {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", role: "assistant", content: "Hello! I'm your restaurant's AI assistant. Ask me anything about the menu or policies to test my knowledge." }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: inputValue };
        // Clean history for backend (remove IDs, map roles if needed)
        // Note: current 'messages' state contains the history BEFORE this new message
        const history = messages.map(m => ({
            role: m.role,
            content: m.content
        }));

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        startTransition(async () => {
            const result = await sendMessage(userMsg.content, history);

            if (result.error) {
                const errorMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${result.error}` };
                setMessages(prev => [...prev, errorMsg]);
            } else {
                const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: result.response || "No response." };
                setMessages(prev => [...prev, aiMsg]);
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([{ id: "1", role: "assistant", content: "Chat cleared. Ready for new testing!" }]);
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] p-6 gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Agent Playground</h2>
                    <p className="text-muted-foreground">Test how your bot responds to customer queries.</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearChat}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Chat
                </Button>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border-2 shadow-sm">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full items-start gap-2",
                                msg.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === "assistant" && (
                                <Avatar className="h-8 w-8 mt-1 border bg-white">
                                    <AvatarFallback><Bot className="h-4 w-4 text-orange-600" /></AvatarFallback>
                                </Avatar>
                            )}

                            <div
                                className={cn(
                                    "rounded-lg px-4 py-2 max-w-[80%] text-sm shadow-sm",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-slate-800 border"
                                )}
                            >
                                {msg.role === "user" ? (
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                ) : (
                                    <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 font-normal">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                a: ({ node, ...props }) => <a {...props} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" />,
                                                strong: ({ node, ...props }) => <strong {...props} className="font-bold text-slate-900" />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {msg.role === "user" && (
                                <Avatar className="h-8 w-8 mt-1 border bg-white">
                                    <AvatarFallback><User className="h-4 w-4 text-blue-600" /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex justify-start gap-2">
                            <Avatar className="h-8 w-8 mt-1 border bg-white">
                                <AvatarFallback><Bot className="h-4 w-4 text-orange-600" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-white border rounded-lg px-4 py-2 text-sm text-muted-foreground flex items-center">
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>
                <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type a message (e.g., 'What's the price of Pizza?')"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isPending}
                            className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={isPending || !inputValue.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
