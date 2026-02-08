'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRestaurant() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Try to find restaurant linked to user
    let { data: restaurant, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
        .single()

    // If not found (error code PGRST116 means no rows found), create a default one
    if (!restaurant || (error && error.code === 'PGRST116')) {
        const { data: newRest, error: createError } = await supabase
            .from('restaurants')
            .insert({
                name: "My New Restaurant",
                owner_id: user.id,
                phone_number: user.phone || ""
            })
            .select()
            .single()

        if (createError) {
            console.error("Error creating restaurant:", createError)
            return null
        }
        restaurant = newRest
    }

    // Handing the case where existing restaurants (from before migration) might not have owner_id
    // Ideally we would backfill, but for now, we assume fresh start or manual link.
    // If user has NO restaurant, the above block handles it.

    return restaurant
}

export async function updateRestaurant(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: "Unauthorized" }

    const name = formData.get('name') as string
    const phone_number = formData.get('phone_number') as string
    const address = formData.get('address') as string
    const currency = formData.get('currency') as string
    const id = formData.get('id') as string

    const { error } = await supabase
        .from('restaurants')
        .update({ name, phone_number, address, currency })
        .eq('id', id)
        .eq('owner_id', user.id) // Security check

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function uploadKnowledgeBase(formData: FormData) {
    const supabase = await createClient()
    const restaurant = await getRestaurant()

    if (!restaurant) return { error: "No restaurant found" }

    const file = formData.get('file') as File
    if (!file) return { error: "No file provided" }

    // Prepare FormData for Backend API
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('restaurant_id', restaurant.id)

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/v1/rag/upload`, {
            method: 'POST',
            body: backendFormData,
            // Note: Content-Type header is automatically set by fetch with FormData
        })

        if (!response.ok) {
            const errorText = await response.text()
            return { error: `Upload failed: ${errorText}` }
        }

        const result = await response.json()
        return { success: true, message: result.message }

    } catch (error) {
        console.error("Upload error:", error)
        return { error: "Failed to connect to backend service" }
    }
}
