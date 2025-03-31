// "use client"
// import ChatWindow from "@/components/ChatWindow";
// import UserSelector from "@/components/UserSelector";
// import { useState } from "react";
// import { users } from "@/lib/data";

// export default function Home() {
//   const [selectedUser, setSelectedUser] = useState("user1");
//   const user = users.find((u) => u.id === selectedUser);

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
//       <h1 className="text-2xl font-bold mb-4">Customer Care Bot</h1>
//       <UserSelector onUserChange={setSelectedUser} />
//       {user && (
//         <div className="mt-2 text-sm text-gray-600">
//           <p>Selected User: {user.name} ({user.phoneNumber})</p>
//           <p>Active Plan: {user.orders.find((o) => o.status === "Active")?.plan || "None"}</p>
//         </div>
//       )}
//       <div className="mt-4">
//         <ChatWindow userId={selectedUser} />
//       </div>
//     </main>
//   );
// }


// app/page.tsx
"use client"
import ChatWindow from "@/components/ChatWindow";
import UserSelector from "@/components/UserSelector";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  orders: {
    orderId: string;
    date: string;
    plan: string;
    status: string;
  }[];
  incidents: {
    incidentId: string;
    date: string;
    description: string;
    status: string;
  }[];
}

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser) return;
    
    async function fetchUserDetails() {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${selectedUser}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user details');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserDetails();
  }, [selectedUser]);

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Customer Care Bot</h1>
      <UserSelector onUserChange={handleUserChange} />
      
      {loading && <div className="mt-2 text-sm text-gray-600">Loading user details...</div>}
      
      {!loading && user && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Selected User: {user.name} ({user.phoneNumber})</p>
          <p>Active Plan: {
            user.orders.find((o) => o.status === "Active")?.plan || "None"
          }</p>
        </div>
      )}
      
      {selectedUser && (
        <div className="mt-4">
          <ChatWindow userId={selectedUser} />
        </div>
      )}
    </main>
  );
}