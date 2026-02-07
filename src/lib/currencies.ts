export type Currency = {
    value: string;
    label: string;
    symbol: string;
};

export const currencies: Currency[] = [
    { value: "USD", label: "USD - United States Dollar", symbol: "$" },
    { value: "EUR", label: "EUR - Euro", symbol: "€" },
    { value: "GBP", label: "GBP - British Pound", symbol: "£" },
    { value: "JPY", label: "JPY - Japanese Yen", symbol: "¥" },
    { value: "CNY", label: "CNY - Chinese Yuan", symbol: "¥" },
    { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
    { value: "PKR", label: "PKR - Pakistani Rupee", symbol: "₨" },
    { value: "CAD", label: "CAD - Canadian Dollar", symbol: "$" },
    { value: "AUD", label: "AUD - Australian Dollar", symbol: "$" },
    { value: "AED", label: "AED - United Arab Emirates Dirham", symbol: "د.إ" },
    { value: "SAR", label: "SAR - Saudi Riyal", symbol: "﷼" },
    { value: "CHF", label: "CHF - Swiss Franc", symbol: "Fr" },
    { value: "ZAR", label: "ZAR - South African Rand", symbol: "R" },
    { value: "SGD", label: "SGD - Singapore Dollar", symbol: "$" },
    { value: "MYR", label: "MYR - Malaysian Ringgit", symbol: "RM" },
    { value: "PHP", label: "PHP - Philippine Peso", symbol: "₱" },
    { value: "IDR", label: "IDR - Indonesian Rupiah", symbol: "Rp" },
    { value: "THB", label: "THB - Thai Baht", symbol: "฿" },
    { value: "VND", label: "VND - Vietnamese Dong", symbol: "₫" },
    { value: "KRW", label: "KRW - South Korean Won", symbol: "₩" },
    { value: "TRY", label: "TRY - Turkish Lira", symbol: "₺" },
    { value: "RUB", label: "RUB - Russian Ruble", symbol: "₽" },
    { value: "BRL", label: "BRL - Brazilian Real", symbol: "R$" },
    { value: "MXN", label: "MXN - Mexican Peso", symbol: "$" },
    { value: "NZD", label: "NZD - New Zealand Dollar", symbol: "$" },
    { value: "HKD", label: "HKD - Hong Kong Dollar", symbol: "$" },
    { value: "SEK", label: "SEK - Swedish Krona", symbol: "kr" },
    { value: "NOK", label: "NOK - Norwegian Krone", symbol: "kr" },
    { value: "DKK", label: "DKK - Danish Krone", symbol: "kr" },
    { value: "PLN", label: "PLN - Polish Zloty", symbol: "zł" },
    { value: "ILS", label: "ILS - Israeli New Shekel", symbol: "₪" },
    { value: "EGP", label: "EGP - Egyptian Pound", symbol: "£" },
    { value: "BDT", label: "BDT - Bangladeshi Taka", symbol: "৳" },
    { value: "NGN", label: "NGN - Nigerian Naira", symbol: "₦" },
    { value: "KES", label: "KES - Kenyan Shilling", symbol: "KSh" },
    { value: "ARS", label: "ARS - Argentine Peso", symbol: "$" },
    { value: "CLP", label: "CLP - Chilean Peso", symbol: "$" },
];
// Add as many as needed or use a library.
export const getCurrencySymbol = (code: string | null | undefined): string => {
    if (!code) return "$";
    // Check if it's already a symbol (legacy support)
    if (["$", "€", "£", "¥", "₹"].includes(code)) return code;

    const valid = currencies.find(c => c.value === code);
    return valid ? valid.symbol : code; // Fallback to code if no symbol found or returns code if it looks like a symbol
};
