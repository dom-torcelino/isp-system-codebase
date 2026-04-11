import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { LoginForm } from "@/features/auth/components/LoginForm";

// Why: This page is rendered on the server, shipping zero JavaScript to the client except for the isolated LoginForm component.
export default function LoginPage() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>

            <LoginForm />
        </div>
    );
}