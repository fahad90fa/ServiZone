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
      toast.success('Account created! You can now sign in.');
      navigate('/');
    } else {
      toast.error('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
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
          <h1 className="font-sans text-2xl font-bold text-foreground">Create account</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">Join ServiZone today</p>
        </div>

        <Card className="border-border bg-card p-5">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><User className="h-3.5 w-3.5 text-primary" /> Full Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Mail className="h-3.5 w-3.5 text-primary" /> Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Phone className="h-3.5 w-3.5 text-primary" /> Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <div>
              <Label className="mb-1.5 font-body text-sm text-foreground/70">I want to</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={form.role === 'user' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'user' })} className={`flex-1 rounded-lg font-body text-xs ${form.role === 'user' ? 'bg-primary text-primary-foreground' : 'border-border'}`}>
                  Book Services
                </Button>
                <Button type="button" size="sm" variant={form.role === 'provider' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'provider' })} className={`flex-1 rounded-lg font-body text-xs ${form.role === 'provider' ? 'bg-primary text-primary-foreground' : 'border-border'}`}>
                  Provide Services
                </Button>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Lock className="h-3.5 w-3.5 text-primary" /> Password *</Label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm text-foreground/70"><Lock className="h-3.5 w-3.5 text-primary" /> Confirm Password *</Label>
              <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" className="bg-secondary border-border focus:border-primary/50" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-lg font-body text-sm">
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
