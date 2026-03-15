'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocale } from '@/contexts/LocaleContext';
import { loginAction, type LoginState } from '@/actions/auth';

function SubmitButton() {

    const { pending } = useFormStatus();
    return (
        // Why: Utilize the imported UI Button component for design consistency instead of a raw HTML button.
        <Button type="submit" className="w-full mt-2" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    );
}

export function LoginForm() {
    const initialState: LoginState = { error: undefined };
    const { t } = useLocale();

    // Why: Explicitly set the initial state to undefined instead of null to satisfy TypeScript.
    // Why: Removed useState. Next.js natively handles form data extraction, saving memory and unnecessary re-renders.
    const [state, formAction] = useFormState(loginAction, initialState);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">{t.login.title}</h1>
                    <p className="text-muted-foreground">{t.login.subtitle}</p>
                </div>

                {/* Why: Removed conflicting padding/shadow/bg classes. Let the parent Card handle the layout container. */}
                <form action={formAction} className="flex flex-col gap-4">
                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">{t.login.username}</Label>
                        {/* Why: The 'name' attribute is strictly required for Next.js to populate FormData. */}
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@fiberfast.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t.login.password}</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <SubmitButton />
                </form>
            </Card>
        </div>
    );
}