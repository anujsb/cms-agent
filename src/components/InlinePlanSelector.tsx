// components/InlinePlanSelector.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InlinePlanSelectorProps {
  onPlanSelected: (product: string, plan: string) => void;
  initialProduct?: string;
}

const productIcons: Record<string, string> = {
  SIM: "📱",
  Phone: "📲",
  Internet: "📶",
  TV: "📺"
};

export default function InlinePlanSelector({ onPlanSelected, initialProduct }: InlinePlanSelectorProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProduct || "SIM");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const products = ["SIM", "Phone", "Internet", "TV"];
  
  const plans: Record<string, Array<{id: string, name: string, price: string, feature: string}>> = {
    SIM: [
      { id: "Basic", name: "Basic", price: "€10/mo", feature: "5GB data" },
      { id: "Premium", name: "Premium", price: "€20/mo", feature: "20GB data" },
      { id: "Unlimited", name: "Unlimited", price: "€30/mo", feature: "Unlimited data" },
      { id: "Family", name: "Family", price: "€45/mo", feature: "50GB shared" }
    ],
    Phone: [
      { id: "Basic", name: "Basic", price: "€25/mo", feature: "5GB data" },
      { id: "Premium", name: "Premium", price: "€35/mo", feature: "20GB data" },
      { id: "Unlimited", name: "Unlimited", price: "€45/mo", feature: "Unlimited data" },
      { id: "Family", name: "Family", price: "€60/mo", feature: "50GB shared" }
    ],
    Internet: [
      { id: "Basic", name: "Basic", price: "€30/mo", feature: "50 Mbps" },
      { id: "Premium", name: "Premium", price: "€45/mo", feature: "300 Mbps" },
      { id: "Unlimited", name: "Unlimited", price: "€60/mo", feature: "1 Gbps" },
      { id: "Family", name: "Family", price: "€70/mo", feature: "1 Gbps + mesh" }
    ],
    TV: [
      { id: "Basic", name: "Basic", price: "€15/mo", feature: "30+ channels" },
      { id: "Premium", name: "Premium", price: "€25/mo", feature: "100+ channels" },
      { id: "Unlimited", name: "Unlimited", price: "€40/mo", feature: "150+ sports" },
      { id: "Family", name: "Family", price: "€50/mo", feature: "200+ channels" }
    ]
  };

  return (
    <Card className="w-full border border-blue-100 bg-blue-50/50 mt-2 overflow-hidden">
      <CardContent className="p-3">
        <Tabs defaultValue={selectedProduct} onValueChange={(val) => setSelectedProduct(val)}>
          <TabsList className="grid grid-cols-4 mb-3 h-8 bg-blue-100/50">
            {products.map(product => (
              <TabsTrigger 
                key={product} 
                value={product}
                className="text-xs data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <span className="mr-1">{productIcons[product]}</span> {product}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {products.map(product => (
            <TabsContent key={product} value={product} className="mt-0">
              <div className="grid grid-cols-2 gap-2">
                {plans[product].map(plan => (
                  <div 
                    key={plan.id}
                    className={`
                      relative p-2 border rounded cursor-pointer text-xs
                      ${selectedPlan === plan.id && selectedProduct === product 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="font-medium">{plan.name}</div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-gray-600">{plan.feature}</div>
                      <div className="font-bold text-blue-600">{plan.price}</div>
                    </div>
                    {selectedPlan === plan.id && selectedProduct === product && (
                      <CheckCircle size={14} className="absolute top-2 right-2 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-3">
                <Button 
                  size="sm"
                  disabled={!selectedPlan}
                  onClick={() => onPlanSelected(product, selectedPlan!)}
                  className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                >
                  <ShoppingCart size={12} className="mr-1" />
                  Order {product} {selectedPlan || ''}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}