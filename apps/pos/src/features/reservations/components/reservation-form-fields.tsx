import type {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

// ==========================================
// FORM ROW WRAPPER
// ==========================================
export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

// ==========================================
// INPUT FIELD
// ==========================================
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export function InputField({ label, required, ...props }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
      />
    </div>
  );
}

// ==========================================
// SELECT FIELD
// ==========================================
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export function SelectField({
  label,
  required,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary font-medium"
      >
        {children}
      </select>
    </div>
  );
}

// ==========================================
// TEXTAREA FIELD
// ==========================================
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextareaField({ label, ...props }: TextareaFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-on-surface-variant mb-1">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full p-3 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary h-20"
      />
    </div>
  );
}
