"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeaderProps {
    user: User;
}

export const Header = ({ user }: HeaderProps) => {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User";
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const initials = displayName.substring(0, 2).toUpperCase();

    return (
        <div className="border-b h-16 flex items-center px-6 bg-white shrink-0">
            {/* Mobile Sidebar */}
            <div className="md:hidden mr-4">
                <Sheet>
                    <SheetTrigger>
                        <Menu />
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-900 w-72">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="ml-auto flex items-center gap-4">
                <div className="text-sm font-medium text-gray-500">
                    Hello, <span className="font-bold text-gray-900">{displayName}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar>
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuLabel className="font-normal text-xs text-muted-foreground truncate max-w-[150px]">
                            {user.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleSignOut}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
