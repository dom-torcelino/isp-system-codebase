import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Lock } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { t } = useLocale();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo credentials check
    if (username === 'admin' && password === 'Admin123') {
      onLogin(username, password);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-foreground mb-2">{t.login.title}</h1>
          <p className="text-muted-foreground">{t.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">{t.login.username}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.login.username}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.login.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.login.password}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {t.login.signIn}
          </Button>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              {t.login.demoCredentials}: <span className="font-medium">admin</span> / <span className="font-medium">Admin123</span>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
