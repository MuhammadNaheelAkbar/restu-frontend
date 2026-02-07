"use client";
import Link from "next/link";

export const Footer = () => (
    <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-2">
                    <div className="text-2xl font-bold flex items-center space-x-2 mb-6">
                        <span className="text-green-600">Restu</span>
                        <span>.AI</span>
                    </div>
                    <p className="text-gray-500 max-w-sm mb-6">
                        The #1 AI Sales Agent for Restaurants using WhatsApp.
                        We help you scale without adding headcount.
                    </p>
                    <div className="flex space-x-4">
                        {/* Social Placeholders */}
                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 bg-gray-200 rounded-full hover:bg-green-600 transition cursor-pointer"></div>)}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><Link href="#" className="hover:text-green-600">Features</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Changelog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                    <ul className="space-y-4 text-gray-500">
                        <li><Link href="#" className="hover:text-green-600">About</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Careers</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Blog</Link></li>
                        <li><Link href="#" className="hover:text-green-600">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between text-sm text-gray-400">
                <div>&copy; 2026 Restu AI. All rights reserved.</div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Terms of Service</Link>
                </div>
            </div>
        </div>
    </footer>
)
