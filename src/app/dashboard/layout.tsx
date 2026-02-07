import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardRealtimeProvider } from "@/providers/dashboard-realtime-provider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    return (
        <div className="h-full relative">
            {/* Desktop Sidebar */}
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>

            <main className="md:pl-72 h-full bg-gray-50 flex flex-col">
                <Header user={user} />
                <div className="flex-1 overflow-y-auto">
                    <DashboardRealtimeProvider>
                        {children}
                    </DashboardRealtimeProvider>
                </div>
            </main>
        </div>
    );
}
