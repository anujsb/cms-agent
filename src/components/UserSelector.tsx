// app/components/UserSelector.tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/lib/data";

interface UserSelectorProps {
  onUserChange: (userId: string) => void;
}

export default function UserSelector({ onUserChange }: UserSelectorProps) {
  const [selectedUser, setSelectedUser] = useState(users[0].id);

  const handleChange = (value: string) => {
    setSelectedUser(value);
    onUserChange(value);
  };

  return (
    <Select value={selectedUser} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}