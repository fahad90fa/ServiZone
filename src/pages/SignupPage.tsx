import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wrench, Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserRole } from '@/contexts/AuthContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' as UserRole });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const success = await signup(form.name, form.email, form.phone, form.password, form.role);
    setLoading(false);
    if (success) {
      toast.success('Account created! Check your email to confirm.');
      navigate('/');
    } else {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-8 overflow-hidden">
      {/* Mesh bg */}
      <div className="absolute inset-0 gradient-mesh opacity-60" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: '3s' }} />

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
          <h1 className="font-sans text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 font-body text-muted-foreground">Join ServiZone today</p>
        </div>

        <Card className="glass border-border/50 p-6 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><User className="h-3.5 w-3.5 text-primary" /> Full Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" className="bg-background/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Mail className="h-3.5 w-3.5 text-primary" /> Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" className="bg-background/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Phone className="h-3.5 w-3.5 text-primary" /> Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="bg-background/50" />
            </div>
            <div>
              <Label className="mb-1.5 font-body text-sm">I want to</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={form.role === 'user' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'user' })} className={`flex-1 ${form.role === 'user' ? 'gradient-primary border-0 text-primary-foreground' : ''}`}>
                  Book Services
                </Button>
                <Button type="button" size="sm" variant={form.role === 'provider' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'provider' })} className={`flex-1 ${form.role === 'provider' ? 'gradient-primary border-0 text-primary-foreground' : ''}`}>
                  Provide Services
                </Button>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Lock className="h-3.5 w-3.5 text-primary" /> Password *</Label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="bg-background/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Lock className="h-3.5 w-3.5 text-primary" /> Confirm Password *</Label>
              <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" className="bg-background/50" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm font-body text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
