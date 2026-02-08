'use server'

import { createClient } from "@/lib/supabase/server"
import { getRestaurant } from "../settings/actions"

export async function sendMessage(message: string, history: { role: string, content: string }[], conversationId: string = "default") {
    const restaurant = await getRestaurant()
    if (!restaurant) return { error: "No restaurant found" }

    const payload = {
        restaurant_id: restaurant.id,
        message: message,
        conversation_id: conversationId,
        history: history
    }

    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
        const res = await fetch(`${backendUrl}/api/v1/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error("Chat API Error:", errorText)
            return { error: "Failed to get response from agent." }
        }

        const data = await res.json()
        return { response: data.response }

    } catch (e) {
        console.error("Chat Action Error:", e)
        return { error: "Failed to connect to AI service." }
    }
}
