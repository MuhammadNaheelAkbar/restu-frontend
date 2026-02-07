"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Trash2, Edit, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createMenuItem, createCategory, deleteMenuItem, importMenu } from "./actions";

interface Category {
    id: string;
    name: string;
}

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    category_id: string;
    categories: { name: string } | null;
    is_available: boolean;
}

export function MenuClient({ categories, menuItems, currency = "$" }: { categories: Category[], menuItems: MenuItem[], currency?: string }) {
    const [isPending, startTransition] = useTransition();
    const [isItemDialogOpen, setItemDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateItem = async (formData: FormData) => {
        startTransition(async () => {
            await createMenuItem(formData);
            setItemDialogOpen(false);
        });
    };

    const handleCreateCategory = async (formData: FormData) => {
        startTransition(async () => {
            await createCategory(formData);
            setCategoryDialogOpen(false);
        })
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            startTransition(async () => {
                await deleteMenuItem(id);
            })
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const xlsx = await import("xlsx");
            const reader = new FileReader();

            reader.onload = async (evt) => {
                const bstr = evt.target?.result;
                const wb = xlsx.read(bstr, { type: "binary" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = xlsx.utils.sheet_to_json(ws);

                // Transform data
                const items = data.map((row: any) => ({
                    name: row.Name || row.name,
                    description: row.Description || row.description,
                    price: parseFloat(row.Price || row.price || "0"),
                    category: row.Category || row.category,
                    variant: row.Variant || row.variant || row.Variants || null
                })).filter(i => i.name && i.price);

                if (items.length > 0) {
                    startTransition(async () => {
                        const result = await importMenu(items);
                        if (result?.error) {
                            alert(result.error);
                        } else {
                            alert(`Successfully imported ${result?.count} items!`);
                        }
                    });
                } else {
                    alert("No valid items found in Excel. Ensure headers are: Name, Price, Description, Category");
                }

                // Reset input
                if (fileInputRef.current) fileInputRef.current.value = "";
            };
            reader.readAsBinaryString(file);

        } catch (error) {
            console.error("Import failed", error);
            alert("Failed to parse Excel file");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
                    <p className="text-muted-foreground">Manage your dishes, prices, and availability.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
                        <Upload className="mr-2 h-4 w-4" />
                        {isPending ? "Importing..." : "Import Excel"}
                    </Button>

                    <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Category</DialogTitle>
                                <DialogDescription>Create a new section for your menu (e.g., Starters).</DialogDescription>
                            </DialogHeader>
                            <form action={handleCreateCategory}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="cat-name">Category Name</Label>
                                        <Input id="cat-name" name="name" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Category"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isItemDialogOpen} onOpenChange={setItemDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Dish</DialogTitle>
                                <DialogDescription>
                                    Add a new item to your menu. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <form action={handleCreateItem}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" placeholder="Margherita Pizza" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Price ({currency})</Label>
                                        <Input id="price" name="price" type="number" step="0.01" placeholder="12.99" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select name="categoryId" required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description (for AI)</Label>
                                        <Textarea id="description" name="description" placeholder="Describe ingredients and options..." />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Item"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-lg shadow-sm bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No items found. Add your first dish or Import from Excel!
                                </TableCell>
                            </TableRow>
                        ) : (
                            menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div>{item.name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{item.categories?.name || 'Uncategorized'}</Badge>
                                    </TableCell>
                                    <TableCell>{currency}{item.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.is_available ? "outline" : "destructive"} className={item.is_available ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                            {item.is_available ? "In Stock" : "Sold Out"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} disabled={isPending}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
