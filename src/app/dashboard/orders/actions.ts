'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
    const supabase = await createClient()

    // Fetch orders with their items
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id,
        quantity,
        variant_name,
        menu_items (
          name,
          price
        )
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching orders:", error)
        return []
    }

    return data
}

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        console.error("Error updating order:", error)
        return { error: "Failed to update status" }
    }

    revalidatePath('/dashboard/orders')
    return { success: true }
}
