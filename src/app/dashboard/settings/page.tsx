import { getRestaurant } from "./actions";
import { SettingsClient } from "./client";

export default async function SettingsPage() {
    const restaurant = await getRestaurant();

    return (
        <SettingsClient restaurant={restaurant} />
    );
}
