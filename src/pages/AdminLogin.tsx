import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const ADMIN_PASSKEY = 'Hustle';

const AdminLogin = () => {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (passkey === ADMIN_PASSKEY) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        toast.success('Access granted!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid passkey');
        setPasskey('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card border-border/50 animate-fade-in">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">Admin Portal</CardTitle>
          <CardDescription>
            Enter passkey to access admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPasskey ? "text" : "password"}
                placeholder="Enter passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasskey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!passkey || isLoading}
            >
              {isLoading ? 'Verifying...' : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
