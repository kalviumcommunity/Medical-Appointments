"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/schemas/signup.schema";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("Signup Data:", data);
  };

  return (
    <main className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 bg-gray-50 p-6 border rounded-lg space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Signup</h1>

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register("name")}
            className="w-full border p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}
