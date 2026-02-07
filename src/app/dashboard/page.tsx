import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { getCurrencySymbol } from "@/lib/currencies";

export const revalidate = 0; // Ensure dynamic data fetching

export default async function DashboardPage() {
    const supabase = await createClient();

    // 1. Fetch Stats & Currency
    // Parallelize queries for performance
    const [
        { count: activeOrdersCount },
        { data: recentOrders },
        { data: revenueData },
        user
    ] = await Promise.all([
        // Active Orders (Not Completed or Cancelled)
        supabase.from("orders")
            .select("*", { count: 'exact', head: true })
            .in("status", ["pending", "confirmed", "cooking", "ready"]),

        // Recent Orders
        supabase.from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),

        // Revenue (All time - simplified for MVP)
        // Note: Supabase doesn't have a simple 'sum' without rpc or fetching all. 
        // For strictly correct architecture we should use an RPC or a materialized view.
        // For MVP, we'll fetch 'completed' orders and sum in JS (careful with scale!).
        // Better approach: Create a `get_dashboard_stats` RPC function.
        // Let's stick to a simple fetch for now or use a "safe" limit.
        supabase.from("orders").select("total_amount").eq("status", "completed"),

        // Get User to find restaurant info
        supabase.auth.getUser().then(r => r.data.user)
    ]);

    // Fetch Restaurant Currency
    // (Ideally this should be cached or part of a global context, but simple fetch works for now)
    let currencyCode = "USD";
    if (user) {
        const { data: rest } = await supabase.from('restaurants').select('currency').eq('owner_id', user.id).single();
        if (rest && rest.currency) {
            currencyCode = rest.currency;
        }
    }
    const currencySymbol = getCurrencySymbol(currencyCode);

    // Calculate details
    const totalRevenue = revenueData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

    // Default values if no data
    const orders = recentOrders || [];

    return (
        <div className="p-8 space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your restaurant's performance.</p>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currencySymbol}{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">All time earnings</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeOrdersCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Orders in progress</p>
                    </CardContent>
                </Card>

                {/* Placeholders for future metrics */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">--</div>
                        <p className="text-xs text-muted-foreground">Requires Customer Table</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                        <p className="text-xs text-muted-foreground">Agent is listening</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No orders yet.
                                    </TableCell>
                                </TableRow>
                            ) : orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
                                    <TableCell>{order.customer_phone}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "destructive" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}</TableCell>
                                    <TableCell className="text-right">{currencySymbol}{order.total_amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
