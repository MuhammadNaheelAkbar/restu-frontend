"use client";
import { FadeIn } from "@/components/ui/fade-in";

export const HowItWorks = () => (
    <section id="how-it-works" className="py-24 bg-gray-900 text-white overflow-hidden relative">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6">From "Hi" to "Order" in Seconds</h2>
                <p className="text-gray-400 text-lg">No app downloads. Just pure conversation.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gray-700/50 -z-10"></div>

                {[
                    { step: "01", title: "Customer Chats", desc: "Sends a message on WhatsApp." },
                    { step: "02", title: "AI Responds", desc: "Instantly sends menu & options." },
                    { step: "03", title: "Smart Order", desc: "Collects address & preferences." },
                    { step: "04", title: "Kitchen Sync", desc: "You get a ticket in the dashboard." },
                ].map((s, i) => (
                    <FadeIn key={i} delay={i * 0.1} className="relative flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-xl font-bold text-green-400 mb-6 shadow-xl shadow-green-900/20 z-10">
                            {s.step}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                        <p className="text-gray-400 text-sm max-w-[200px]">{s.desc}</p>
                    </FadeIn>
                ))}
            </div>
        </div>
    </section>
)
