"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import posthog from "posthog-js";
import { profile } from "@/lib/data";
import CopyEmail from "@/components/shared/CopyEmail";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const fieldOrder: (keyof Fields)[] = ["name", "email", "subject", "message"];

function a11y(errors: Errors, key: keyof Fields) {
  return {
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
    "aria-required": true,
  } as const;
}

const empty: Fields = { name: "", email: "", subject: "", message: "" };

const inputCls =
  "w-full rounded-xl border border-line-strong bg-transparent px-4 py-3.5 text-ink placeholder:text-ink-3 transition-colors focus:border-violet focus:outline-none focus-visible:ring-2 focus-visible:ring-violet aria-[invalid=true]:border-error";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="tag mb-2 block text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="tag mt-2 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof Fields]) setErrors((er) => ({ ...er, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  function validate(f: Fields): Errors {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Please enter your name.";
    if (!f.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (!f.subject.trim()) e.subject = "Please enter a subject.";
    if (!f.message.trim() || f.message.trim().length < 10) e.message = "Tell me a bit more (10+ characters).";
    return e;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(fields);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = fieldOrder.find((k) => found[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, honeypot }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to deliver message");
      }

      setSubmitted(true);
      setFields(empty);
      try {
        posthog.capture("contact_form_submitted", { submission_method: "api" });
      } catch {
        // Safe posthog call
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again or email directly.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line-strong bg-paper-deep/50 p-8 text-center md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-live/15 text-live">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="display-2 mt-5 text-ink">Message received</h3>
        <p className="measure mx-auto mt-3 text-ink-2">
          Thanks for reaching out! Your message was delivered directly. I typically respond within 24 hours.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn-label flip flip-outline px-6 py-3"
          >
            Send another message
          </button>
          <CopyEmail location="contact_success" className="btn-label flip flip-violet px-6 py-3" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {serverError && (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-4 text-error" role="alert">
          <p className="text-sm font-medium">{serverError}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            {...a11y(errors, "name")}
            value={fields.name}
            onChange={onChange}
            className={inputCls}
            placeholder="Your name"
            autoComplete="name"
            disabled={submitting}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            {...a11y(errors, "email")}
            type="email"
            value={fields.email}
            onChange={onChange}
            className={inputCls}
            placeholder="you@company.com"
            autoComplete="email"
            spellCheck={false}
            disabled={submitting}
          />
        </Field>
      </div>
      <div className="mt-6">
        <Field id="subject" label="Subject" error={errors.subject}>
          <input
            id="subject"
            name="subject"
            {...a11y(errors, "subject")}
            value={fields.subject}
            onChange={onChange}
            className={inputCls}
            placeholder="Role, automation project, or idea"
            disabled={submitting}
          />
        </Field>
      </div>
      <div className="mt-6">
        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            {...a11y(errors, "message")}
            rows={6}
            maxLength={1500}
            value={fields.message}
            onChange={onChange}
            className={`${inputCls} resize-none`}
            placeholder="Describe what you need built, system constraints, or timelines..."
            disabled={submitting}
          />
        </Field>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-label flip flip-violet px-8 py-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending message..." : "Send message →"}
        </button>
        <CopyEmail location="contact_form" className="btn-label flip flip-outline px-6 py-4" />
        <a href={`mailto:${profile.email}`} className="tag ledger-link text-ink-2">
          Or email directly
        </a>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </form>
  );
}
