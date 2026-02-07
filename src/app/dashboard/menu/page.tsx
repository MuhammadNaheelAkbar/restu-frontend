import { MenuClient } from "./client";
import { getCategories, getMenuItems } from "./actions";

import { createClient } from "@/lib/supabase/server";
import { getCurrencySymbol } from "@/lib/currencies";

export default async function MenuPage() {
    const supabase = await createClient();
    const [categories, menuItems] = await Promise.all([
        getCategories(),
        getMenuItems()
    ]);

    const { data: { user } } = await supabase.auth.getUser();
    let currencyCode = "USD";
    if (user) {
        const { data: rest } = await supabase.from('restaurants').select('currency').eq('owner_id', user.id).single();
        if (rest?.currency) currencyCode = rest.currency;
    }
    const currency = getCurrencySymbol(currencyCode);

    return (
        <MenuClient categories={categories} menuItems={menuItems} currency={currency} />
    );
}
