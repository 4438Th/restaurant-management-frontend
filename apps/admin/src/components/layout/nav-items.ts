import { type IconName } from "@repo/ui";

export interface NavItem {
    title: string;
    href?: string;
    icon: IconName;
    children?: NavItem[];
}

export const sidebarNavItems: NavItem[] = [
    {
        title: "Quản lý người dùng",
        href: "/users",
        icon: "UserCheck",
    },
    {
        title: "Quản lý menu",
        icon: "Utensils",
        children: [
            {
                title: "Danh sách món ăn",
                href: "/menu/dishes",
                icon: "Beef",
            },
            {
                title: "Danh mục món ăn",
                href: "/menu/categories",
                icon: "Layers",
            },
        ],
    },
    {
        title: "Quản lý bàn ăn",
        href: "/tables",
        icon: "Grid",
    },
];