"use client";

import { useState, useTransition } from "react";
import { updateRestaurant } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyCombobox } from "@/components/ui/currency-combobox";
import { saveUserLLMConfig } from "./llm-actions";
import { Badge } from "@/components/ui/badge";
import { Lock, Upload, MessageCircle } from "lucide-react";
import { uploadKnowledgeBase } from "./actions";
import { toast } from "sonner";
import { WhatsAppConfigForm } from "./whatsapp-form";

export function SettingsClient({ restaurant }: { restaurant: any }) {
    const [currency, setCurrency] = useState(restaurant.currency || "USD"); // Default to USD code
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await updateRestaurant(formData);
            if (result.error) {
                toast.error(`Error: ${result.error}`);
            } else {
                toast.success("Settings saved successfully!");
            }
        });
    };

    if (!restaurant) {
        return <div>Loading restaurant details...</div>;
    }

    return (
        <div className="p-8 space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your restaurant profile and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Restaurant Profile</CardTitle>
                    <CardDescription>
                        This information will be used by the AI Agent to answer customer queries.
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <input type="hidden" name="id" value={restaurant.id} />
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Restaurant Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={restaurant.name}
                                placeholder="e.g. Luigi's Pizza"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">WhatsApp Number</Label>
                            <Input
                                id="phone"
                                name="phone_number"
                                defaultValue={restaurant.phone_number}
                                placeholder="e.g. +1234567890"
                                pattern="^\+?[1-9]\d{1,14}$"
                                title="Please enter a valid international phone number (E.164 format, e.g., +1234567890)"
                            />
                            <p className="text-xs text-muted-foreground">The AI will use this to identify your store.</p>
                        </div>
                        <div className="space-y-2 w-full max-w-[50%]">
                            <Label htmlFor="currency">Currency</Label>
                            <input type="hidden" name="currency" value={currency} />
                            <CurrencyCombobox value={currency} onValueChange={setCurrency} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                defaultValue={restaurant.address}
                                placeholder="e.g. 123 Main St, New York"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t px-6 py-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Knowledge Base</CardTitle>
                    <CardDescription>
                        Upload documents (PDF) to teach the AI about your restaurant policies (e.g., parking, history, wifi).
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <KnowledgeBaseUploader />
                </CardContent>
            </Card>


            <Card className="border-green-200 bg-green-50/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        WhatsApp Configuration
                        <Badge variant="outline" className="text-xs font-normal border-green-200 text-green-700 bg-green-100">BYOK</Badge>
                    </CardTitle>
                    <CardDescription>
                        Connect your own WhatsApp Business Number. You get full control over the number and branding.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <WhatsAppConfigForm />
                </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        🤖 AI Configuration
                        <Badge variant="secondary" className="text-xs font-normal">Advanced</Badge>
                    </CardTitle>
                    <CardDescription>
                        Bring your own LLM (Language Model) API Key. Your key is stored securely using Bank-Grade encryption (Vault).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LLMConfigForm />
                </CardContent>
            </Card>
        </div >
    );
}




function KnowledgeBaseUploader() {
    const [isPending, startTransition] = useTransition();
    const [fileName, setFileName] = useState<string | null>(null);

    const handleUpload = (formData: FormData) => {
        startTransition(async () => {
            const promise = uploadKnowledgeBase(formData);

            toast.promise(promise, {
                loading: 'Uploading document...',
                success: (result) => {
                    setFileName(null);
                    return result.message || "Document uploaded successfully!";
                },
                error: (result) => {
                    return result.error || "Failed to upload document";
                }
            });
        });
    };

    return (
        <form action={handleUpload} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 border p-4 rounded-md border-dashed bg-slate-50">
                <Input
                    type="file"
                    name="file"
                    accept=".pdf"
                    className="hidden"
                    id="kb-file"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                />
                <Label htmlFor="kb-file" className="flex items-center gap-2 cursor-pointer text-sm font-medium hover:text-primary transition-colors">
                    <div className="bg-white p-2 rounded border shadow-sm">
                        <Upload className="h-4 w-4" />
                    </div>
                    {fileName ? fileName : "Click to select a PDF file"}
                </Label>
            </div>

            <Button type="submit" disabled={!fileName || isPending} className="self-end" variant="secondary">
                {isPending ? "Processing..." : "Upload Document"}
            </Button>
        </form>
    )
}




function LLMConfigForm() {
    const [isPending, startTransition] = useTransition();

    const handleSave = (formData: FormData) => {
        startTransition(async () => {
            const result = await saveUserLLMConfig(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message || "Configuration saved successfully");
            }
        });
    };

    return (
        <form action={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="base_url">Base URL</Label>
                    <Input
                        id="base_url"
                        name="base_url"
                        placeholder="https://api.openai.com/v1"
                        defaultValue="https://api.openai.com/v1"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model_name">Model Name</Label>
                    <Input
                        id="model_name"
                        name="model_name"
                        placeholder="gpt-4-turbo"
                        defaultValue="gpt-4o"
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="api_key">API Key</Label>
                <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="api_key"
                        name="api_key"
                        type="password"
                        placeholder="sk-..."
                        className="pl-9"
                        required
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Your key is encrypted before storage. We cannot see it.
                </p>
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isPending} variant="default">
                    {isPending ? "Encrypting & Saving..." : "Save Configuration"}
                </Button>
            </div>
        </form>
    )
}
