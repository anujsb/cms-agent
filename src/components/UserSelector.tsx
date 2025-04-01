// app/components/UserSelector.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
}

interface UserSelectorProps {
  onUserChange: (userId: string) => void;
}

export default function UserSelector({ onUserChange }: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Use useEffect with empty dependency array to fetch users only once
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
          // Only set selected user and call onUserChange on initial load
          if (initialLoad) {
            setSelectedUser(data[0].id);
            onUserChange(data[0].id);
            setInitialLoad(false);
          }
        } else {
          setUsers([]);
          setError("No users available");
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error instanceof Error ? error.message : "Failed to load users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []); // Remove onUserChange from dependency array

  // Create a stable handler function that doesn't change on re-renders
  const handleChange = useCallback((value: string) => {
    console.log("Selected user:", value); // Debugging
    setSelectedUser(value);
    onUserChange(value);
  }, [onUserChange]);

  if (loading) {
    return <Skeleton className="h-10 w-[180px]" />;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-2 border border-red-200 rounded bg-red-50">
        {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-2 border border-gray-200 rounded bg-gray-50">
        No users available
      </div>
    );
  }

  return (
    <Select value={selectedUser} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a customer" />
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