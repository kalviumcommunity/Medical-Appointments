interface FormInputProps {
  label: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  type?: string;
}

export default function FormInput({
  label,
  name,
  register,
  error,
  type = "text",
}: FormInputProps) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        {...register(name)}
        aria-invalid={!!error}
        className="w-full border p-2 rounded"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
