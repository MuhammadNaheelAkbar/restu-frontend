'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getRestaurant } from './actions'

export async function saveWhatsAppConfig(formData: FormData) {
    const supabase = await createClient()

    const phoneNumberId = formData.get('phone_number_id') as string
    const businessAccountId = formData.get('business_account_id') as string
    const accessToken = formData.get('access_token') as string

    if (!phoneNumberId || !accessToken) {
        return { error: "Phone Number ID and Access Token are required" }
    }

    // Get the restaurant ID for the current user
    const restaurant = await getRestaurant()
    if (!restaurant) {
        return { error: "Restaurant not found" }
    }

    try {
        // Call the RPC function which handles Encryption
        const { data, error } = await supabase.rpc('save_whatsapp_config', {
            p_restaurant_id: restaurant.id,
            p_phone_number_id: phoneNumberId,
            p_business_account_id: businessAccountId || null,
            p_access_token: accessToken
        })

        if (error) {
            console.error("RPC Error:", error)
            return { error: error.message }
        }

        if (data && !data.success) {
            return { error: data.error || "Failed to save configuration" }
        }

        revalidatePath('/dashboard/settings')
        return { success: true, message: "WhatsApp configuration saved successfully" }

    } catch (e) {
        console.error("Unexpected error:", e)
        return { error: "An unexpected error occurred" }
    }
}

export async function getWebhookConfig() {
    return {
        verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "lala",
        webhookUrl: "https://restu-backend.vercel.app/api/v1/webhook/whatsapp"
    }
}
