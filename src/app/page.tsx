// app/page.tsx
"use client"
import ChatWindow from "@/components/ChatWindow";
import UserSelector from "@/components/UserSelector";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
                <CardTitle className="text-xl font-bold">Customer Care Portal</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2 text-gray-500">SELECT CUSTOMER</h3>
                  <UserSelector onUserChange={handleUserChange} />
                </div>

                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h2 className="text-lg font-bold">{user.name}</h2>
                      <div className="flex items-center mt-2 text-gray-600">
                        <Phone size={16} className="mr-2" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2 text-gray-500">ACTIVE PLAN</h3>
                        {user.orders.find(o => o.status === "Active") ? (
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">
                                {user.orders.find(o => o.status === "Active")?.plan}
                              </span>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <Calendar size={14} className="mr-1" />
                              <span>Since {user.orders.find(o => o.status === "Active")?.date}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-500">No active plan</p>
                        )}
                      </div>
                    </div>

                    <Tabs defaultValue="orders">
                      <TabsList className="grid grid-cols-2 mb-2">
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="incidents">Support History</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="orders" className="space-y-2">
                        {user.orders.length > 0 ? (
                          user.orders.map(order => (
                            <div key={order.orderId} className="bg-white p-3 rounded border border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{order.plan}</span>
                                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Package size={14} className="mr-1" />
                                <span>{order.orderId} • {order.date}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No orders found</p>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="incidents" className="space-y-2">
                        {user.incidents.length > 0 ? (
                          user.incidents.map(incident => (
                            <div key={incident.incidentId} className="bg-white p-3 rounded border border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-medium truncate" title={incident.description}>
                                  {incident.description.length > 40 
                                    ? incident.description.substring(0, 40) + '...' 
                                    : incident.description}
                                </span>
                                <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                <span>{incident.incidentId} • {incident.date}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No support incidents found</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : selectedUser ? (
                  <p className="text-gray-500">Failed to load user details</p>
                ) : (
                  <p className="text-gray-500">Select a user to view details</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="w-full md:w-2/3">
            {selectedUser ? (
              <ChatWindow userId={selectedUser} />
            ) : (
              <Card className="h-full flex items-center justify-center p-8 shadow-md">
                <div className="text-center">
                  <div className="bg-blue-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                    <Phone size={32} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Customer Care Bot</h2>
                  <p className="text-gray-500">Select a customer to start a conversation</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}