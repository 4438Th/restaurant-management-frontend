"use client";

import { Button } from "@repo/ui";

import { useTrashUsers } from "../hooks/use-trash-users";
import { useRestoreUser } from "../hooks/use-restore-user";

export function TrashUsersPage() {
  const { data } = useTrashUsers();

  const restoreUser = useRestoreUser();

  const users = data?.result.data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Trash Users</h1>

      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded border p-3"
        >
          <span>{user.username}</span>

          <Button onClick={() => restoreUser.mutate(user.id)}>Restore</Button>
        </div>
      ))}
    </div>
  );
}
