import type { ReactNode } from "react";

type ChildrenProps = {
  children: ReactNode;
};

export function Th({ children }: ChildrenProps) {
  return <th className="admin-th">{children}</th>;
}

export function Td({
  children,
  className = "",
}: ChildrenProps & { className?: string }) {
  return <td className={`admin-td ${className}`}>{children}</td>;
}

export function PageButton({
  children,
  onClick,
  active,
  disabled,
}: ChildrenProps & {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className={`admin-page-button ${active ? "is-active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

