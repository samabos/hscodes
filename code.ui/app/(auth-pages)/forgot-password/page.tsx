'use client'

import { useEffect, useState, Suspense } from 'react'; 
import { useSearchParams } from 'next/navigation';
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

const ForgotPasswordContent = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<Message>({
    success: '',
    error: '',
    message: '',
  });

  useEffect(() => {
    const success = searchParams!.get('success') || '';
    const error = searchParams!.get('error') || '';
    const messageText = searchParams!.get('message') || '';

    setMessage({ success, error, message: messageText });
  }, [searchParams]);

  return (
    <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
      <div>
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <p className="text-sm text-secondary-foreground">
          Already have an account?{" "}
          <Link className="text-primary underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton formAction={forgotPasswordAction}>
          Reset Password
        </SubmitButton>
        <FormMessage message={message} />
      </div>
    </form>
  );
};

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
      <SmtpMessage />
    </Suspense>
  );
}



