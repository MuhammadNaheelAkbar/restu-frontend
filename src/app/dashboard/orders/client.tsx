"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateOrderStatus } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { CalendarIcon, Clock, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface OrderItem {
    id: string;
    quantity: number;
    variant_name: string | null;
    menu_items: {
        name: string;
        price: number;
    };
}

interface Order {
    id: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    total_amount: number;
    created_at: string;
    order_items: OrderItem[];
}

export function OrdersClient({ initialOrders, currency = "$" }: { initialOrders: any[], currency?: string }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();
    const router = useRouter();

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) { }
    }

    // Real-time updates
    useEffect(() => {
        const channel = supabase
            .channel('realtime_orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        playNotificationSound();
                        router.refresh();
                    } else if (payload.eventType === 'UPDATE') {
                        setOrders((currentOrders) =>
                            currentOrders.map((order) =>
                                order.id === payload.new.id ? { ...order, ...payload.new } : order
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    // Update local state when initialOrders changes (e.g. after router.refresh)
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);


    // Filtering Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                order.id.toLowerCase().includes(searchLower) ||
                order.customer_phone.toLowerCase().includes(searchLower) ||
                (order.customer_name && order.customer_name.toLowerCase().includes(searchLower));

            // Status
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;

            // Date
            let matchesDate = true;
            if (dateRange?.from) {
                const orderDate = new Date(order.created_at);
                const fromDate = dateRange.from;
                const toDate = dateRange.to || dateRange.from; // Default to same day if end not picked

                // Compare dates (ignoring time for simple day filtering)
                // Actually reset times to 0 for accurate comparison
                const orderTime = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();
                const fromTime = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime();
                const toTime = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime();

                matchesDate = orderTime >= fromTime && orderTime <= toTime;
            }

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [orders, searchQuery, statusFilter, dateRange]);


    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleStatusChange = (orderId: string, newStatus: string) => {
        startTransition(async () => {
            setOrders(current => current.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            await updateOrderStatus(orderId, newStatus);
        });
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cooking': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'ready': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage and track your restaurant orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 animate-pulse border-green-500 text-green-600 bg-green-50">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Live Connection Active
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center border p-4 rounded-lg bg-white shadow-sm">
                <div className="grid gap-2 flex-1 w-full md:max-w-sm">
                    <div className="relative">
                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by Order ID or Phone..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>

                <div className="grid gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full md:w-[260px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {(searchQuery || statusFilter !== "all" || dateRange) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                            setDateRange(undefined);
                        }}
                        className="px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="border rounded-md shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">
                                        #{order.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>{format(new Date(order.created_at), "MMM dd, yyyy")}</span>
                                            <span className="text-muted-foreground text-xs">
                                                {format(new Date(order.created_at), "p")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-medium">{order.customer_name || "Guest"}</span>
                                            <span className="text-muted-foreground text-xs">{order.customer_phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 max-w-[200px]">
                                            {order.order_items.map((item, idx) => (
                                                <span key={item.id} className="text-xs truncate" title={`${item.quantity}x ${item.menu_items.name}`}>
                                                    <span className="font-bold">{item.quantity}x</span> {item.menu_items.name}
                                                </span>
                                            ))}
                                            {order.order_items.length > 2 && (
                                                <span className="text-xs text-muted-foreground italic">
                                                    + {order.order_items.length - 2} more...
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {currency}{order.total_amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Select
                                            value={order.status}
                                            onValueChange={(val) => handleStatusChange(order.id, val)}
                                            disabled={isPending}
                                        >
                                            <SelectTrigger className="w-[130px] ml-auto h-8 text-xs">
                                                <SelectValue placeholder="Update Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="cooking">Cooking</SelectItem>
                                                <SelectItem value="ready">Ready</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) setCurrentPage(p => p - 1);
                                }}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {/* Simple Logic for now: Show current, previous, next */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
                            .map((page, idx, arr) => {
                                // Add ellipsis if gap
                                const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                                return (
                                    <div key={page} className="flex items-center">
                                        {showEllipsis && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currentPage}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page);
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </div>
                                )
                            })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                }}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
