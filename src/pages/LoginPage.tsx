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
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/8 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow"
          >
            <Wrench className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-sans text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 font-body text-muted-foreground">Sign in to your ServiZone account</p>
        </div>

        <Card className="glass border-border/50 p-6 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Mail className="h-3.5 w-3.5 text-primary" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="bg-background/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Lock className="h-3.5 w-3.5 text-primary" /> Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="bg-background/50" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300">
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
