import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success('Logged in!');
      navigate('/');
    } else {
      toast.error('Invalid credentials. Try: rahul@example.com, amit@example.com, or admin@servizone.com');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <Wrench className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to ServiZone</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Sign In</Button>
          </form>

          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="mb-1 font-medium">Demo Accounts:</p>
            <p>Customer: rahul@example.com</p>
            <p>Provider: amit@example.com</p>
            <p>Admin: admin@servizone.com</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
