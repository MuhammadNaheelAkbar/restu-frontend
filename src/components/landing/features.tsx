"use client";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Features = () => (
    <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-center">
                <div className="md:w-1/2">
                    <FadeIn>
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-8 rotate-3 text-orange-600">
                            <Zap size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                            Supercharge your <br /> <span className="text-orange-500">Kitchen Operations</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                "Zero-Error Orders (No typos, no misunderstandings)",
                                "Multilingual Support (AI speaks 50+ languages)",
                                "Upselling built-in ('Would you like fries with that?')",
                                "Works 24/7/365 without a break"
                            ].map((f, i) => (
                                <div key={i} className="flex items-start">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                                    <span className="text-lg text-gray-700 font-medium">{f}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10">
                            <Link href="/signup">
                                <Button variant="link" className="text-green-600 font-bold hover:text-green-700 p-0 text-lg h-auto">
                                    Explore All Features <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>
                </div>

                <div className="md:w-1/2">
                    <FadeIn delay={0.2}>
                        <Card className="overflow-hidden border-none shadow-2xl bg-gray-50 h-[500px] relative">
                            <CardContent className="p-0 h-full">
                                {/* Abstract Dashboard Mock */}
                                <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">📊</div>
                                        <div className="font-bold text-gray-400">Live Dashboard Preview</div>
                                    </div>
                                </div>
                                <Image
                                    src="/hero.png" // Reusing the hero image as a placeholder for dashboard too if needed, or just abstract
                                    alt="Dashboard"
                                    fill
                                    className="object-cover opacity-90 grayscale blur-[2px]"
                                />
                            </CardContent>
                        </Card>
                    </FadeIn>
                </div>
            </div>
        </div>
    </section>
)
