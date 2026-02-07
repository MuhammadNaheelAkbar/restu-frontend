"use client";

import { createClient } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the shape of an Order (adjust based on your actual DB schema)
type Order = {
    id: string;
    customer_phone: string;
    status: string;
    total_amount: number;
    created_at: string;
    subtotal: number;
    tax: number;
    restaurant_id: string;
};

type DashboardRealtimeContextType = {
    latestOrder: Order | null;
    isConnected: boolean;
};

const DashboardRealtimeContext = createContext<DashboardRealtimeContextType>({
    latestOrder: null,
    isConnected: false,
});

export const useDashboardRealtime = () => useContext(DashboardRealtimeContext);

export function DashboardRealtimeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [latestOrder, setLatestOrder] = useState<Order | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Create a channel for real-time updates
        const channel = supabase
            .channel('dashboard-orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    console.log('New Order Received:', payload);
                    const newOrder = payload.new as Order;
                    setLatestOrder(newOrder);

                    // Show Notification
                    toast.success(`New Order! ${newOrder.customer_phone} - $${newOrder.total_amount}`, {
                        action: {
                            label: "View",
                            onClick: () => router.push("/dashboard/orders")
                        },
                        duration: 5000,
                    });

                    // Refresh the current route (re-fetches server components)
                    router.refresh();
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    console.log('Order Updated:', payload);
                    // Optionally handle status updates here
                    router.refresh();
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Connected to Supabase Realtime');
                    setIsConnected(true);
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('Realtime connection error');
                    setIsConnected(false);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    return (
        <DashboardRealtimeContext.Provider value={{ latestOrder, isConnected }}>
            {children}
        </DashboardRealtimeContext.Provider>
    );
}
