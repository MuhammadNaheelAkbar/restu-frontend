import { getOrders } from "./actions";
import { OrdersClient } from "./client";
import { createClient } from "@/lib/supabase/server";
import { getCurrencySymbol } from "@/lib/currencies";

export default async function OrdersPage() {
    const orders = await getOrders();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let currencyCode = "USD";
    if (user) {
        const { data: rest } = await supabase.from('restaurants').select('currency').eq('owner_id', user.id).single();
        if (rest?.currency) currencyCode = rest.currency;
    }
    const currency = getCurrencySymbol(currencyCode);

    return (
        <OrdersClient initialOrders={orders || []} currency={currency} />
    );
}
