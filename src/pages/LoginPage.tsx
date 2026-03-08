import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-border bg-card p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Lock className="h-3.5 w-3.5 text-primary" /> Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-lg font-body text-sm">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm font-body text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
