// app/components/ChatWindow.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatWindowProps {
  userId: string;
}

export default function ChatWindow({ userId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I assist you today?",
      isBot: true,
      timestamp: "09:00:00", // Static initial timestamp for server render
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update initial timestamp on client-side after mount
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isBot && msg.text === "Hello! How can I assist you today with Odido?"
          ? { ...msg, timestamp: new Date().toLocaleTimeString() }
          : msg
      )
    );
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId }),
      });
      const data = await res.json();
      const botMessage = { text: data.reply, isBot: true, timestamp: new Date().toLocaleTimeString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not respond", isBot: true, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallSupport = () => {
    alert("Calling Odido Customer Support... (This is a mock action)");
  };

  return (
    <div className="flex flex-col w-full max-w-md border rounded-lg shadow-lg bg-white">
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 p-3 rounded-lg ${
              msg.isBot ? "bg-gray-100 text-left" : "bg-blue-100 text-right"
            }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs text-gray-500">{msg.timestamp}</span>
            {msg.isBot && msg.text.includes("Would you like to call now?") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleCallSupport}
              >
                Call Now
              </Button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm">Bot is typing...</div>
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}