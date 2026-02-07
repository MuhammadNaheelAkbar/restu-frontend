'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { getRestaurant } from '../settings/actions'

export async function getCategories() {
    const supabase = await createClient()
    const restaurant = await getRestaurant()
    if (!restaurant) return []

    const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('sort_order')
    return data || []
}

export async function getMenuItems() {
    const supabase = await createClient()
    // Ideally filter by restaurant, but menu_items doesn't strictly have restaurant_id 
    // column on it in the code I viewed earlier? Wait, checking implementation_plan.
    // Plan said menu_items has category_id. Categories has restaurant_id.
    // So we invoke join.
    const restaurant = await getRestaurant()
    if (!restaurant) return []

    // Filter items where category's restaurant_id = current restaurant
    const { data } = await supabase
        .from('menu_items')
        .select('*, categories!inner(name, restaurant_id)')
        .eq('categories.restaurant_id', restaurant.id)
        .order('name')

    return data || []
}

export async function createMenuItem(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const categoryId = formData.get('categoryId') as string

    // Basic validation
    if (!name || !price || !categoryId) {
        return { error: "Missing required fields" }
    }

    const { error } = await supabase.from('menu_items').insert({
        name,
        description,
        price,
        category_id: categoryId,
        is_available: true
    })

    if (error) {
        console.error(error)
        return { error: "Failed to create item" }
    }

    revalidatePath('/dashboard/menu')
    return { success: true }
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient()
    const name = formData.get('name') as string
    const restaurant = await getRestaurant()

    if (!restaurant) return { error: 'No restaurant found' }
    const restaurantId = restaurant.id

    if (!restaurantId) return { error: 'No restaurant found' }

    const { error } = await supabase.from('categories').insert({
        name,
        restaurant_id: restaurantId,
        sort_order: 1
    })

    if (error) {
        console.error(error)
        return { error: "Failed to create category" }
    }

    revalidatePath('/dashboard/menu')
    return { success: true }
}

export async function deleteMenuItem(id: string) {
    const supabase = await createClient()
    await supabase.from('menu_items').delete().eq('id', id)
    revalidatePath('/dashboard/menu')
}

export async function importMenu(items: { name: string; description?: string; price: number; category: string; variant?: string }[]) {
    const supabase = await createClient()

    // 1. Get or Create Restaurant
    const restaurant = await getRestaurant()
    if (!restaurant) return { error: 'No restaurant found' }
    const restaurantId = restaurant.id

    // 2. Handle Categories
    const uniqueCategories = Array.from(new Set(items.map(i => i.category || 'Uncategorized').filter(Boolean)))

    // Fetch existing
    const { data: existingCats } = await supabase.from('categories').select('id, name').eq('restaurant_id', restaurantId)
    const existingCatMap = new Map(existingCats?.map(c => [c.name.toLowerCase(), c.id]) || [])

    // Identify new
    const newCats = uniqueCategories.filter(c => !existingCatMap.has(c.toLowerCase()))

    // Insert new
    if (newCats.length > 0) {
        const { data: createdCats, error: catError } = await supabase.from('categories').insert(
            newCats.map((name, i) => ({
                name,
                restaurant_id: restaurantId,
                sort_order: (existingCats?.length || 0) + i + 1
            }))
        ).select()

        if (catError) {
            console.error("Cat Error", catError)
            return { error: "Failed to create categories" }
        }

        createdCats?.forEach(c => existingCatMap.set(c.name.toLowerCase(), c.id))
    }

    // 3. Prepare Items
    const menuItemsToInsert = items.map(item => {
        const catId = existingCatMap.get((item.category || 'Uncategorized').toLowerCase())

        // If variant exists, format it as a JSON array
        const variants = item.variant ? [{ name: item.variant, price: item.price }] : null

        return {
            name: item.name,
            description: item.description || '',
            price: item.price,
            category_id: catId,
            is_available: true,
            variants: variants
        }
    })

    // 4. Bulk Insert Items
    const { error: itemError } = await supabase.from('menu_items').insert(menuItemsToInsert)

    if (itemError) {
        console.error("Item Error", itemError)
        return { error: `Failed to import items: ${itemError.message}` }
    }

    revalidatePath('/dashboard/menu')
    return { success: true, count: menuItemsToInsert.length }
}
