import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, MessageCircle, Info, Copy } from "lucide-react";
import { saveWhatsAppConfig, getWebhookConfig } from "./whatsapp-actions";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function WhatsAppConfigForm() {
    const [isPending, startTransition] = useTransition();
    const [webhookConfig, setWebhookConfig] = useState<{ verifyToken: string, webhookUrl: string } | null>(null);

    useEffect(() => {
        // Fetch config
        getWebhookConfig().then(setWebhookConfig);
    }, []);

    const handleSave = (formData: FormData) => {
        startTransition(async () => {
            const result = await saveWhatsAppConfig(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message || "WhatsApp configuration saved successfully");
            }
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Copied to clipboard");
    };

    const callbackUrl = webhookConfig?.webhookUrl || "Loading...";

    return (
        <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full bg-slate-50 rounded-md border px-4">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="hover:no-underline text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            Step 1: Configure Webhook (Required)
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-4 pt-2 pb-4">
                        <p>
                            To receive messages, you must configure the Webhook in your Meta App Dashboard.
                            Go to <strong>WhatsApp &gt; Configuration</strong> and click <strong>Edit</strong>.
                        </p>

                        <div className="grid gap-4 p-4 border rounded bg-white">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-slate-500">Callback URL</Label>
                                <div className="flex items-center gap-2">
                                    <Input readOnly value={callbackUrl} className="font-mono text-xs bg-slate-50" />
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(callbackUrl)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase text-slate-500">Verify Token</Label>
                                <div className="flex items-center gap-2">
                                    <Input readOnly value={webhookConfig?.verifyToken || "..."} className="font-mono text-xs bg-slate-50" />
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(webhookConfig?.verifyToken || "")}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-[10px]">
                                    This is a shared security token for our platform.
                                </p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <form action={handleSave} className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2">
                    <span className="text-sm font-medium text-slate-700">Step 2: Enter Credentials</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone_number_id">Phone Number ID</Label>
                        <Input
                            id="phone_number_id"
                            name="phone_number_id"
                            placeholder="e.g. 321654987123456"
                            required
                        />
                        <p className="text-[10px] text-muted-foreground">Found in WhatsApp Business Manager &gt; API Setup &gt; Phone Number ID</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="business_account_id">Business Account ID (Optional)</Label>
                        <Input
                            id="business_account_id"
                            name="business_account_id"
                            placeholder="e.g. 100123456789012"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="access_token">Permanent Access Token</Label>
                    <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="access_token"
                            name="access_token"
                            type="password"
                            placeholder="EAA..."
                            className="pl-9"
                            required
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                        This token is encrypted at rest. Use a System User token with <code>whatsapp_business_messaging</code> permission.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {isPending ? "Securely Saving..." : "Connect WhatsApp"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
