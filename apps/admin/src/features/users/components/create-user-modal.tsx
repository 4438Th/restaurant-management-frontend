"use client";

import { useState } from "react";

import { Button, Input, Modal } from "@repo/ui";

import { useCreateUser } from "../hooks/use-create-user";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateUserModal({ open, onClose }: Props) {
  const createUser = useCreateUser();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [fullName, setFullName] = useState("");

  async function handleSubmit() {
    await createUser.mutateAsync({
      username,
      password,
      fullName,
      roles: [],
    });

    onClose();
  }

  if (!open) return null;

  return (
    <Modal>
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Create User</h2>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Save</Button>

          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
