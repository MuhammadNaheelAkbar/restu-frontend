"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Settings,
    MessageSquare,
    LogOut
} from "lucide-react";

const routes = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Orders",
        icon: ShoppingBag,
        href: "/dashboard/orders",
        color: "text-violet-500",
    },
    {
        label: "Menu",
        icon: UtensilsCrossed,
        href: "/dashboard/menu",
        color: "text-pink-700",
    },
    {
        label: "AI Agent",
        icon: MessageSquare,
        href: "/dashboard/agent",
        color: "text-orange-700",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/dashboard/settings",
    },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-2">R</div>
                    <h1 className="text-2xl font-bold">Restu.AI</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <button
                    onClick={async () => {
                        const { createClient } = await import("@/lib/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                    }}
                    className="text-zinc-400 text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Sign Out
                    </div>
                </button>
            </div>
        </div>
    );
};
