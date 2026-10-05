"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { profile } from "@/lib/data";

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
  "w-full rounded-xl border border-[#7d8496] bg-transparent px-4 py-3.5 text-ink placeholder:text-ink-3 transition-colors focus:border-violet focus:outline-none focus-visible:ring-1 focus-visible:ring-violet aria-[invalid=true]:border-error";

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

function mailtoFor(f: Fields) {
  const subject = encodeURIComponent(f.subject || "Hello");
  const body = encodeURIComponent(`Hi,\n\n${f.message}\n\n${f.name} (${f.email})`.replace(/\n/g, "\r\n"));
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [toast, setToast] = useState<{ open: boolean; kind: "success" | "error"; message: string }>({
    open: false,
    kind: "success",
    message: "",
  });

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof Fields]) setErrors((er) => ({ ...er, [name]: undefined }));
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(fields);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = fieldOrder.find((k) => found[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    // Honeypot filled: silently drop, like a bot submission.
    if (honeypot) {
      setFields(empty);
      return;
    }
    window.location.href = mailtoFor(fields);
    setToast({ open: true, kind: "success", message: "Opening your email app to send it." });
  }

  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(() => setToast((s) => ({ ...s, open: false })), 4000);
    return () => clearTimeout(t);
  }, [toast.open]);

  return (
    <form onSubmit={onSubmit} noValidate>
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
            placeholder="you@example.com"
            autoComplete="email"
            spellCheck={false}
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
            placeholder="What's this about?"
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
            placeholder="Share details, links, or timelines…"
          />
        </Field>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="btn-label flip flip-violet px-8 py-4 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send message →
        </button>
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
      <div
        className={`fixed bottom-6 right-6 z-[85] transition-[opacity,transform] duration-200 ${
          toast.open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
        role={toast.kind === "error" ? "alert" : "status"}
        aria-live={toast.kind === "error" ? "assertive" : "polite"}
      >
        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-3 shadow-[0_16px_32px_-16px_rgba(10,8,20,0.45)] ${
            toast.kind === "error" ? "bg-error text-paper" : "bg-ink text-paper"
          }`}
        >
          <span className="tag">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast((s) => ({ ...s, open: false }))}
            className="tag rounded-full border border-paper/30 px-1.5 py-0.5 hover:bg-paper hover:text-ink"
            aria-label="Dismiss notification"
            tabIndex={toast.open ? undefined : -1}
            aria-hidden={toast.open ? undefined : true}
          >
            ×
          </button>
        </div>
      </div>
    </form>
  );
}
