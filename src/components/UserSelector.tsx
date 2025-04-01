// // // app/components/UserSelector.tsx
// // "use client";

// // import { useState } from "react";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { users } from "@/lib/data";

// // interface UserSelectorProps {
// //   onUserChange: (userId: string) => void;
// // }

// // export default function UserSelector({ onUserChange }: UserSelectorProps) {
// //   const [selectedUser, setSelectedUser] = useState(users[0].id);

// //   const handleChange = (value: string) => {
// //     setSelectedUser(value);
// //     onUserChange(value);
// //   };

// //   return (
// //     <Select value={selectedUser} onValueChange={handleChange}>
// //       <SelectTrigger className="w-[180px]">
// //         <SelectValue placeholder="Select a user" />
// //       </SelectTrigger>
// //       <SelectContent>
// //         {users.map((user) => (
// //           <SelectItem key={user.id} value={user.id}>
// //             {user.name}
// //           </SelectItem>
// //         ))}
// //       </SelectContent>
// //     </Select>
// //   );
// // }

// // app/components/UserSelector.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface User {
//   id: string;
//   name: string;
// }

// interface UserSelectorProps {
//   onUserChange: (userId: string) => void;
// }

// export default function UserSelector({ onUserChange }: UserSelectorProps) {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<string>("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchUsers() {
//       try {
//         const response = await fetch('/api/users');
//         const data = await response.json();
//         setUsers(data);
        
//         if (data.length > 0) {
//           setSelectedUser(data[0].id);
//           onUserChange(data[0].id);
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//         setLoading(false);
//       }
//     }
    
//     fetchUsers();
//   }, [onUserChange]);

//   const handleChange = (value: string) => {
//     setSelectedUser(value);
//     onUserChange(value);
//   };

//   if (loading) {
//     return <div>Loading users...</div>;
//   }

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
          setSelectedUser(data[0].id);
          onUserChange(data[0].id);
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
  }, [onUserChange]);

  const handleChange = (value: string) => {
    setSelectedUser(value);
    onUserChange(value);
  };

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