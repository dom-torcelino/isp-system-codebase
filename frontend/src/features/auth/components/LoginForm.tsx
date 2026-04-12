'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useLocale } from '@/shared/contexts/LocaleContext';
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
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember" name="remember" />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                            Remember me
                        </Label>
                    </div>

                    <SubmitButton />
                </form>
            </Card>
        </div>
    );
}