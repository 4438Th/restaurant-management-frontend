import { type IconName } from "@repo/ui";

export interface NavItem {
    title: string;
    href?: string;
    icon: IconName;
    children?: NavItem[];
}

export const posNavItems: NavItem[] = [
    {
        title: "Bán hàng",
        href: "/pos",
        icon: "ShoppingCart",
    },
    {
        title: "Sơ đồ bàn ăn",
        href: "/tables",
        icon: "LayoutGrid",
    },
    {
        title: "Lịch đặt bàn",
        href: "/reservations",
        icon: "CalendarCheck",
    },
    {
        title: "Danh sách đơn hàng",
        href: "/orders",
        icon: "Receipt",
    },
    {
        title: "Báo cáo doanh thu",
        href: "/reports",
        icon: "BarChart3",
    },
];