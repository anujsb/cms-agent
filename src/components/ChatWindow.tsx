// // app/components/ChatWindow.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface Message {
//   text: string;
//   isBot: boolean;
//   timestamp: string;
// }

// interface ChatWindowProps {
//   userId: string;
// }

// export default function ChatWindow({ userId }: ChatWindowProps) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       text: "Hello! How can I assist you today?",
//       isBot: true,
//       timestamp: "09:00:00", // Static initial timestamp for server render
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Update initial timestamp on client-side after mount
//   useEffect(() => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.isBot && msg.text === "Hello! How can I assist you today with Odido?"
//           ? { ...msg, timestamp: new Date().toLocaleTimeString() }
//           : msg
//       )
//     );
//   }, []);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { text: input, isBot: false, timestamp: new Date().toLocaleTimeString() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input, userId }),
//       });
//       const data = await res.json();
//       const botMessage = { text: data.reply, isBot: true, timestamp: new Date().toLocaleTimeString() };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { text: "Error: Could not respond", isBot: true, timestamp: new Date().toLocaleTimeString() },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCallSupport = () => {
//     alert("Calling Odido Customer Support... (This is a mock action)");
//   };

//   return (
//     <div className="flex flex-col w-full max-w-md border rounded-lg shadow-lg bg-white">
//       <ScrollArea className="flex-1 p-4">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-4 p-3 rounded-lg ${
//               msg.isBot ? "bg-gray-100 text-left" : "bg-blue-100 text-right"
//             }`}
//           >
//             <p>{msg.text}</p>
//             <span className="text-xs text-gray-500">{msg.timestamp}</span>
//             {msg.isBot && msg.text.includes("Would you like to call now?") && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="mt-2"
//                 onClick={handleCallSupport}
//               >
//                 Call Now
//               </Button>
//             )}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="text-gray-500 text-sm">Bot is typing...</div>
//         )}
//       </ScrollArea>
//       <div className="p-4 border-t">
//         <div className="flex gap-2">
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your query..."
//             onKeyPress={(e) => e.key === "Enter" && handleSend()}
//             disabled={isLoading}
//           />
//           <Button onClick={handleSend} disabled={isLoading}>
//             {isLoading ? "Sending..." : "Send"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/components/ChatWindow.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Send, Phone, RotateCw } from "lucide-react";

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
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Reset chat when user changes
  useEffect(() => {
    setMessages([
      {
        text: "Hello! How can I assist you today?",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [userId]);

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
        { text: "Sorry, I'm having trouble connecting to the server. Please try again later or contact our support team directly.", isBot: true, timestamp: new Date().toLocaleTimeString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallSupport = () => {
    alert("Calling Odido Customer Support... (This is a mock action)");
  };

  const handleReset = () => {
    setMessages([
      {
        text: "Hello! How can I assist you today?",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Customer Support</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-blue-700" 
              onClick={handleReset}
              title="Reset conversation"
            >
              <RotateCw size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
              onClick={handleCallSupport}
              title="Call support"
            >
              <Phone size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isBot 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                    {msg.timestamp}
                  </div>
                  
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
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '100ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send size={16} className="mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}