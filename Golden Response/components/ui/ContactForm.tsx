"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormValues } from "@/lib/validations";
import { useState } from "react";
import type { ApiResponse } from "@/types";

interface ContactFormProps {
  onSuccess: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setApiError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse = await res.json();
      if (json.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setApiError(json.error ?? "Something went wrong.");
      }
    } catch {
      setApiError("Network error. Please check your connection.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-emerald-400 font-semibold text-lg">Message sent!</p>
        <p className="text-zinc-400 text-sm mt-1">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {apiError && (
        <div role="alert" className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Name <span className="text-rose-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          aria-label="Your full name"
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
          className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
          placeholder="Alex Chen"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Email <span className="text-rose-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          aria-label="Your email address"
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
          className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
          placeholder="alex@example.com"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Phone <span className="text-rose-400">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          aria-label="Your phone number"
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
          className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
          placeholder="+91 9876543210"
        />
        {errors.phone && (
          <p id="phone-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Message <span className="text-zinc-500 text-xs">(optional)</span>
        </label>
        <textarea
          id="message"
          aria-label="Your message"
          aria-describedby={errors.message ? "message-error" : undefined}
          rows={4}
          {...register("message")}
          className="w-full rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
          placeholder="Tell me about your project…"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-xs text-rose-400">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Send your message"
        className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
