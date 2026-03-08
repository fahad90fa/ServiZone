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
import { UserRole } from '@/types';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' as UserRole });

  const handleSubmit = (e: React.FormEvent) => {
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
    signup(form.name, form.email, form.phone, form.role);
    toast.success('Account created successfully!');
    navigate('/');
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
            <Wrench className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground">Join ServiZone today</p>
        </div>

        <Card className="border border-border p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Full Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email *</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div>
              <Label className="mb-1.5">I want to</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={form.role === 'user' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'user' })} className="flex-1">
                  Book Services
                </Button>
                <Button type="button" size="sm" variant={form.role === 'provider' ? 'default' : 'outline'} onClick={() => setForm({ ...form, role: 'provider' })} className="flex-1">
                  Provide Services
                </Button>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Password *</Label>
              <Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Confirm Password *</Label>
              <Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" />
            </div>
            <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Create Account</Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
