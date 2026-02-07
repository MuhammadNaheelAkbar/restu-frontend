"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl flex items-center gap-2">
                    <span className="text-green-600">Restu</span>.AI
                </Link>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">How it Works</Link>
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-600 hover:text-green-600">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6">Get Early Access</Button>
                    </Link>
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetTitle>Menu</SheetTitle>
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="#features" className="text-lg font-medium">Features</Link>
                                <Link href="#how-it-works" className="text-lg font-medium">How it Works</Link>
                                <hr className="border-gray-100" />
                                <Link href="/login">
                                    <Button variant="outline" className="w-full justify-start">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Get Early Access</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
