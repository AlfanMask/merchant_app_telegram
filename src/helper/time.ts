import type { Day } from "../constants/merchant";
import type Merchant from "../constants/merchant";

const isMerchantOpen = (now: Date, merchant: Merchant): boolean => {
    const currentDay = now.toLocaleString("id-ID", { weekday: "long" }) as Day;
    const currentHour = now.getHours();
    const isOpenDay = merchant.open_days.includes(currentDay);
    const isWithinOpenHours = currentHour >= merchant.open_hour && currentHour < merchant.close_hour;
    return isOpenDay && isWithinOpenHours;
};

export { isMerchantOpen }