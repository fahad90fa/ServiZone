import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!currentUser) return null;

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name, phone })
      .eq('id', currentUser.id);
    setSaving(false);
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated!');
    }
  };

  return (
    <div className="container max-w-xl py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="mb-8 font-sans text-3xl font-bold text-foreground">My Profile</h1>

        <Card className="glass border-border/50 p-6 shadow-elevated">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-sans text-xl font-bold text-foreground">{currentUser.name}</h2>
              <p className="font-body text-sm capitalize text-muted-foreground">{currentUser.role} • {currentUser.status}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><User className="h-3.5 w-3.5 text-primary" /> Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="bg-background/50 font-body rounded-lg" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Mail className="h-3.5 w-3.5 text-primary" /> Email</Label>
              <Input defaultValue={currentUser.email} disabled className="bg-muted/50 font-body rounded-lg" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Phone className="h-3.5 w-3.5 text-primary" /> Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-background/50 font-body rounded-lg" />
            </div>
            <div>
              <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Calendar className="h-3.5 w-3.5 text-primary" /> Member Since</Label>
              <Input defaultValue={new Date(currentUser.createdAt).toLocaleDateString()} disabled className="bg-muted/50 font-body rounded-lg" />
            </div>

            <Button
              disabled={saving}
              className="w-full gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all font-body rounded-xl"
              onClick={handleSave}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
