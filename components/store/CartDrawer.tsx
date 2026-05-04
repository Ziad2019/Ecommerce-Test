// components/store/CartDrawer.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <ShoppingBag className="h-16 w-16 mb-4" />
            <p className="text-lg">السلة فارغة</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-gray-50 rounded-xl p-3"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-primary font-bold">${item.price}</p>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-primary">${totalPrice().toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-primary text-white text-center py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors block"
              >
                إتمام الشراء →
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}