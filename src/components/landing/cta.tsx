"use client";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";

export const CTA = () => (
    <section className="py-24 bg-green-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black opacity-5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
            <FadeIn>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                    Stop Typing. Start Serving.
                </h2>
                <p className="text-green-100 text-xl mb-12 max-w-2xl mx-auto font-medium">
                    Join the 500+ restaurants automating their WhatsApp orders today.
                    Setup takes less than 5 minutes.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/signup">
                        <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold text-lg rounded-full px-10 h-16 shadow-2xl hover:-translate-y-1 transition-transform w-full sm:w-auto">
                            Get Early Access
                        </Button>
                    </Link>
                    <Link href="#">
                        <Button variant="outline" size="lg" className="bg-transparent text-white border-green-400 hover:bg-green-700 hover:text-white font-bold text-lg rounded-full px-10 h-16 w-full sm:w-auto">
                            Schedule Demo
                        </Button>
                    </Link>
                </div>
            </FadeIn>
        </div>
    </section>
)
