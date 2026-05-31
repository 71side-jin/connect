export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
};

export default function FilterField({
  label,
  value,
  onChange,
  options,
  disabled,
}: Props) {
  return (
    <div className="admin-filter-field">
      <label className="admin-filter-label">{label}</label>

      <select
        className="admin-filter-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

