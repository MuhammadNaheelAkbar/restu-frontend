"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleIcon } from "@/components/ui/google-icon";
import { login, signInWithGoogle } from "./actions";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();

    const handleGoogleLogin = () => {
        startTransition(() => {
            signInWithGoogle();
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Link href="/" className="absolute top-8 left-8 text-xl font-bold flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">R</div>
                <span>Restu<span className="text-green-600">.AI</span></span>
            </Link>

            <Card className="w-full max-w-md shadow-xl border-gray-100">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your email to sign in to your restaurant dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full h-11 border-gray-200 hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700"
                        onClick={handleGoogleLogin}
                        disabled={isPending}
                    >
                        <GoogleIcon className="w-5 h-5" />
                        Sign in with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <form action={login} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="restaurant@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="text-xs text-green-600 font-medium hover:underline">Forgot password?</Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-11 font-bold text-base" disabled={isPending}>
                            {isPending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 justify-center">
                    Don't have an account?
                    <Link href="/signup" className="ml-1 text-green-600 font-bold hover:underline">
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
