"use client";

import { Button } from "@repo/ui";
import type { User } from "@repo/core";

interface UsersTableProps {
  users: User[];
  onDelete?: (id: string) => void;
}

export function UsersTable({ users, onDelete }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="p-3">Username</th>
            <th className="p-3">Full Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Roles</th>
            <th className="p-3 w-32">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-3">{user.username}</td>

              <td className="p-3">{user.fullName}</td>

              <td className="p-3">{user.status}</td>

              <td className="p-3">{user.roles.join(", ")}</td>

              <td className="p-3">
                <Button variant="danger" onClick={() => onDelete?.(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
