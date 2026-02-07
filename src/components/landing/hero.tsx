"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-100 px-3 py-1 rounded-full text-green-700 text-xs font-bold uppercase tracking-wide mb-6">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span>New: AI Auto-Reply</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                                Turn WhatsApp <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Chats into Revenue</span>
                            </h1>
                            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
                                The AI Agent that answers menus, takes orders, and syncs with your kitchen—all inside WhatsApp.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup">
                                    <Button size="lg" className="rounded-full bg-gray-900 hover:bg-green-600 text-white font-bold text-lg h-14 px-8 shadow-xl hover:shadow-green-500/20 w-full sm:w-auto">
                                        Start Free Trial
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="#demo">
                                    <Button variant="outline" size="lg" className="rounded-full border-gray-200 text-gray-700 font-bold text-lg h-14 px-8 hover:bg-gray-50 w-full sm:w-auto">
                                        Watch Demo
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center gap-4 text-sm text-gray-400 font-medium">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} width={32} height={32} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <p>Trusted by 500+ restaurants</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:w-1/2 relative h-[600px] w-full flex items-center justify-center">
                        <motion.div style={{ y: y1 }} className="absolute right-0 top-0 z-0">
                            <div className="bg-orange-400 w-24 h-24 rounded-2xl rotate-12 blur-sm opacity-20"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative z-10 w-full max-w-sm"
                        >
                            <div className="relative rounded-[2.5rem] border-[8px] border-gray-900 overflow-hidden shadow-2xl bg-white aspect-[9/19]">
                                {/* Fake WhatsApp UI */}
                                <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">🤖</div>
                                    <div>
                                        <div className="font-bold text-sm">Restu Bot</div>
                                        <div className="text-[10px] opacity-80">Online</div>
                                    </div>
                                </div>
                                <div className="bg-[#ECE5DD] h-full p-4 overflow-hidden relative">
                                    <div className="space-y-4 text-sm">
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                                            <p className="font-bold text-green-700 text-xs mb-1">Customer</p>
                                            Do you have pepperoni pizza?
                                        </div>
                                        <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[90%] ml-auto">
                                            <p className="font-bold text-gray-800 text-xs mb-1">Restu Bot</p>
                                            Yes! We have <b>Pepperoni Feast</b>.
                                            <br />
                                            🍕 Large: $18
                                            <br />
                                            🍕 Medium: $14
                                            <div className="mt-2 text-xs text-gray-500">Want to add one?</div>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                                            One Large please.
                                        </div>
                                        <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[90%] ml-auto animate-pulse">
                                            <p>✅ Added <b>Large Pepperoni</b> to your order.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl"></div>
                            </div>
                        </motion.div>

                        {/* Floating elements */}
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute -left-10 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-20"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Order #204</div>
                                <div className="text-xs text-gray-500">$42.50 • Paid via Link</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
