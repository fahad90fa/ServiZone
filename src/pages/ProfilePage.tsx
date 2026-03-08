import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="container max-w-xl py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">My Profile</h1>

      <Card className="border border-border p-6 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
            <p className="text-sm capitalize text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 flex items-center gap-1"><User className="h-3.5 w-3.5" /> Full Name</Label>
            <Input defaultValue={currentUser.name} />
          </div>
          <div>
            <Label className="mb-1.5 flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
            <Input defaultValue={currentUser.email} />
          </div>
          <div>
            <Label className="mb-1.5 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</Label>
            <Input defaultValue={currentUser.phone} />
          </div>
          <div>
            <Label className="mb-1.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Member Since</Label>
            <Input defaultValue={currentUser.createdAt} disabled />
          </div>

          <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={() => toast.success('Profile updated!')}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
