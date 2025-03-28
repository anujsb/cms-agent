"use client"
import ChatWindow from "@/components/ChatWindow";
import UserSelector from "@/components/UserSelector";
import { useState } from "react";
import { users } from "@/lib/data";

export default function Home() {
  const [selectedUser, setSelectedUser] = useState("user1");
  const user = users.find((u) => u.id === selectedUser);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Odido Customer Care Bot</h1>
      <UserSelector onUserChange={setSelectedUser} />
      {user && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Selected User: {user.name} ({user.phoneNumber})</p>
          <p>Active Plan: {user.orders.find((o) => o.status === "Active")?.plan || "None"}</p>
        </div>
      )}
      <div className="mt-4">
        <ChatWindow userId={selectedUser} />
      </div>
    </main>
  );
}