// // app/components/UserSelector.tsx
// "use client";

// import { useState } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { users } from "@/lib/data";

// interface UserSelectorProps {
//   onUserChange: (userId: string) => void;
// }

// export default function UserSelector({ onUserChange }: UserSelectorProps) {
//   const [selectedUser, setSelectedUser] = useState(users[0].id);

//   const handleChange = (value: string) => {
//     setSelectedUser(value);
//     onUserChange(value);
//   };

//   return (
//     <Select value={selectedUser} onValueChange={handleChange}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue placeholder="Select a user" />
//       </SelectTrigger>
//       <SelectContent>
//         {users.map((user) => (
//           <SelectItem key={user.id} value={user.id}>
//             {user.name}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

// app/components/UserSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
        
        if (data.length > 0) {
          setSelectedUser(data[0].id);
          onUserChange(data[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, [onUserChange]);

  const handleChange = (value: string) => {
    setSelectedUser(value);
    onUserChange(value);
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

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