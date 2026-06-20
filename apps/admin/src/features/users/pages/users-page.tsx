"use client";

import { useState } from "react";

import { Button } from "@repo/ui";

import { useUsers } from "../hooks/use-users";
import { useDeleteUser } from "../hooks/use-delete-user";

import { UsersTable } from "../components/users-table";
import { CreateUserModal } from "../components/create-user-modal";

export function UsersPage() {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useUsers();

  const deleteUser = useDeleteUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const users = data?.result.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Users</h1>

        <Button onClick={() => setOpen(true)}>Create User</Button>
      </div>

      <UsersTable users={users} onDelete={(id) => deleteUser.mutate(id)} />

      <CreateUserModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
