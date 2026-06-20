import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

export function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="min-w-[400px] rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}
