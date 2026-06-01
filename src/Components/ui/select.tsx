import { cn } from "@/lib/utils"

type SelectFieldProps = {
  label?: string
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function SelectField({ label, options, value, onChange, placeholder, className }: SelectFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export { SelectField }
export type { SelectFieldProps }
