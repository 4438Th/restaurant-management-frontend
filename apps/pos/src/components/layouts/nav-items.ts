import { type IconName } from "@repo/ui";

export interface NavItem {
    title: string;
    href?: string;
    icon: IconName;
    children?: NavItem[];
}

export const posNavItems: NavItem[] = [
    {
        title: "Trang chủ",
        href: "/",
        icon: "Home",
    },
    {
        title: "Sơ đồ bàn ăn",
        href: "/tables",
        icon: "Grid",
    },
    {
        title: "Quản lý gọi món",
        icon: "Utensils",
        children: [
            {
                title: "Tạo đơn mới",
                href: "/orders/new",
                icon: "PlusCircle",
            },
            {
                title: "Danh sách đơn hàng",
                href: "/orders",
                icon: "Receipt",
            },
        ],
    },
    {
        title: "Báo cáo doanh thu",
        href: "/reports",
        icon: "BarChart2",
    },
    {
        title: "Cài đặt thiết bị",
        href: "/settings",
        icon: "Settings",
    },
];