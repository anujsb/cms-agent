// components/OrderButton.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductSelector from "./ProductSelector";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner"


interface OrderButtonProps {
  userId: string;
  onOrderComplete?: (orderId: string) => void;
}

export default function OrderButton({ userId, onOrderComplete }: OrderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

  const handleProductSelected = async (product: string, plan: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productName: product,
          plan,
          status: "Active",
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }
      
    //   toast({
    //     title: "Order Placed Successfully",
    //     description: `Your order for ${product} with ${plan} plan has been confirmed. Order ID: ${data.orderId}`,
    //     variant: "default",
    //   });
    toast("Order Placed Successfully.")

      
      // Close the dialog
      setIsDialogOpen(false);
      
      // Call the callback if provided
      if (onOrderComplete) {
        onOrderComplete(data.orderId);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    //   toast({
    //     title: "Order Failed",
    //     description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    //     variant: "destructive",
    //   });
    toast("Order Failed.")

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Place New Order</DialogTitle>
          <DialogDescription>
            Select a product and plan to add to your account.
          </DialogDescription>
        </DialogHeader>
        
        <ProductSelector 
          onProductSelected={handleProductSelected} 
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}