import type { Category } from "./category";

export default interface Merchant {
    id: string,
    title: string,
    category: Category,
    is_parking_free: boolean,
    gmap_url: string,
    open_days: Array<Day>,
    open_hour: number,
    close_hour: number,
    num_orders: number,
    is_easy_driver: boolean,
}

enum Day {
    Monday = "Senin",
    Tuesday = "Selasa",
    Wednesday = "Rabu",
    Thursday = "Kamis",
    Friday = "Jumat",
    Saturday = "Sabtu",
    Sunday = "Minggu",
}

const allDays: Array<Day> = [
    Day.Monday,
    Day.Tuesday,
    Day.Wednesday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday,
    Day.Sunday
];

export { Day, allDays }