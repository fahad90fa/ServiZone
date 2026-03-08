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
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-primary/6 blur-[100px] animate-float" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-accent/5 blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow animate-glow-pulse"
          >
            <Wrench className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-sans text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 font-body text-muted-foreground">Sign in to your ServiZone account</p>
        </div>

        <Card className="glass-dark border-border/30 p-6 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="bg-secondary/50 border-border/40 focus:border-primary/50 transition-colors" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Lock className="h-3.5 w-3.5 text-primary" /> Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="bg-secondary/50 border-border/40 focus:border-primary/50 transition-colors" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-500 h-11 rounded-xl">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm font-body text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">Sign Up</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
