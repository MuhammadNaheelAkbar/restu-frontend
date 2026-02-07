"use client";
import { FadeIn } from "@/components/ui/fade-in";
import { Clock, Smartphone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Problem = () => (
    <section id="problem" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
            <FadeIn className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3">The Problem</h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">WhatsApp Orders are a Mess.</h3>
                <p className="text-gray-500 text-lg">You love the orders, but hate the chaos. Manual chatting is killing your efficiency.</p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <Clock className="w-6 h-6 text-red-500" />,
                        title: "Slow Response Time",
                        desc: "Customers wait 10+ minutes for a reply. By then, they've ordered mainly from somewhere else."
                    },
                    {
                        icon: <Smartphone className="w-6 h-6 text-red-500" />,
                        title: "Typing Fatigue",
                        desc: "Copy-pasting 'Here is the menu' 50 times a day is a waste of your valuable staff time."
                    },
                    {
                        icon: <TrendingUp className="w-6 h-6 text-red-500" />,
                        title: "Lost Revenue",
                        desc: "Missed messages inside buried chats mean lost money on the table every single day."
                    },
                ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <Card className="h-full border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">{item.icon}</div>
                                <CardTitle className="text-xl font-bold text-gray-900">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    </FadeIn>
                ))}
            </div>
        </div>
    </section>
)
