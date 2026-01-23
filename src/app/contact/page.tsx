"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/lib/schemas/contact.schema";
import FormInput from "@/components/FormInput";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <main className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="w-96 bg-gray-50 p-6 border rounded-lg space-y-4"
      >
        <h1 className="text-xl font-bold">Contact</h1>

        <FormInput
          label="Name"
          name="name"
          register={register}
          error={errors.name?.message}
        />

        <FormInput
          label="Email"
          name="email"
          register={register}
          error={errors.email?.message}
        />

        <FormInput
          label="Message"
          name="message"
          register={register}
          error={errors.message?.message}
        />

        <button className="bg-green-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </main>
  );
}
