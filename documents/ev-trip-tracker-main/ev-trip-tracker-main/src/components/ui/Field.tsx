import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const labelClass =
  "block text-[11px] font-extrabold tracking-[0.07em] uppercase text-stone mb-1.5";

const controlClass =
  "w-full px-3.5 py-3 border-[1.5px] border-line rounded-[13px] text-[15px] font-semibold bg-white text-ink outline-none";

// Label wrapper so every field lines up consistently.
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {hint ? (
          <span className="text-[#c3b8a6] normal-case tracking-normal font-bold">
            {" "}
            {hint}
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function SelectInput({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${controlClass} ${props.className ?? ""}`}>
      {children}
    </select>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${controlClass} resize-y font-[inherit] ${props.className ?? ""}`}
    />
  );
}
