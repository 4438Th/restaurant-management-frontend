import React from "react";
import { type IconName } from "../icon";

export interface NavItem {
    title: string;
    href?: string;
    icon: IconName;
    children?: NavItem[];
}

export interface SidebarProps {
    brandTitle: string;
    items: NavItem[];
    pathname: string;
    onLogout: () => void;
    isPendingLogout?: boolean;
    renderLink: (
        href: string,
        className: string,
        children: React.ReactNode
    ) => React.ReactNode;
}