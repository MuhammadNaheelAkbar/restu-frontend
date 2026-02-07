'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveUserLLMConfig(formData: FormData) {
    const supabase = await createClient()

    const baseUrl = formData.get('base_url') as string
    const modelName = formData.get('model_name') as string
    const apiKey = formData.get('api_key') as string

    if (!baseUrl || !modelName || !apiKey) {
        return { error: "All fields are required" }
    }

    try {
        // Call the RPC function which handles Vault insertion securely
        const { data, error } = await supabase.rpc('save_user_config', {
            p_base_url: baseUrl,
            p_model_name: modelName,
            p_api_key: apiKey
        })

        if (error) {
            console.error("RPC Error:", error)
            return { error: error.message }
        }

        if (data && !data.success) {
            return { error: data.error || "Failed to save configuration" }
        }

        revalidatePath('/dashboard/settings')
        return { success: true, message: "Configuration saved successfully" }

    } catch (e) {
        console.error("Unexpected error:", e)
        return { error: "An unexpected error occurred" }
    }
}
