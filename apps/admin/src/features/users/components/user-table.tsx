"use client";

import { Icon } from "@/components/ui/icon";
import { User, UserStatus } from "../users.types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-bright text-[12px] font-semibold text-on-surface-variant border-b border-outline-variant">
            <th className="p-4 w-12 text-center">
              <input
                className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                type="checkbox"
              />
            </th>
            <th className="p-4">User Details</th>
            <th className="p-4">Username</th>
            <th className="p-4">Roles (RBAC)</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-on-surface divide-y divide-outline-variant">
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-on-surface-variant"
              >
                Loading application users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-4 text-center text-on-surface-variant"
              >
                No system accounts found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-surface-container-low transition-colors"
              >
                <td className="p-4 text-center">
                  <input
                    className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                    type="checkbox"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px]">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{user.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-[13px] text-primary">
                  {user.username}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((roleName) => (
                        <span
                          key={roleName}
                          className="px-2 py-0.5 bg-primary-container/10 text-primary font-bold text-[11px] rounded border border-primary/20 uppercase tracking-wider"
                        >
                          {roleName}{" "}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-on-surface-variant italic">
                        No Roles Assigned
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold ${
                      user.status === UserStatus.ACTIVE
                        ? "bg-green-600/10 text-green-600"
                        : user.status === UserStatus.PENDING
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-error/10 text-error"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="p-1 text-on-surface-variant hover:text-primary transition-colors rounded hover:bg-surface-variant">
                    <Icon name="MoreHorizontal" className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
