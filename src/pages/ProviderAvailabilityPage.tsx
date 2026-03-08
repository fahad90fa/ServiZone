import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar, Clock } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

const defaultSchedule: Record<string, DaySchedule> = {
  Monday: { enabled: true, start: '09:00', end: '18:00' },
  Tuesday: { enabled: true, start: '09:00', end: '18:00' },
  Wednesday: { enabled: true, start: '09:00', end: '18:00' },
  Thursday: { enabled: true, start: '09:00', end: '18:00' },
  Friday: { enabled: true, start: '09:00', end: '18:00' },
  Saturday: { enabled: true, start: '10:00', end: '14:00' },
  Sunday: { enabled: false, start: '09:00', end: '18:00' },
};

const ProviderAvailabilityPage = () => {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [maxJobs, setMaxJobs] = useState(5);

  const updateDay = (day: string, updates: Partial<DaySchedule>) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], ...updates } }));
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Availability</h1>
      <p className="mb-6 text-muted-foreground">Set your working hours and job preferences</p>

      <Card className="border border-border p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Calendar className="h-5 w-5 text-primary" /> Weekly Schedule
        </h2>

        <div className="space-y-3">
          {days.map(day => (
            <div key={day} className={`flex items-center gap-4 rounded-lg border border-border p-3 transition-colors ${schedule[day].enabled ? '' : 'opacity-50'}`}>
              <Switch checked={schedule[day].enabled} onCheckedChange={v => updateDay(day, { enabled: v })} />
              <span className="w-24 text-sm font-medium text-foreground">{day}</span>
              {schedule[day].enabled ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={schedule[day].start}
                    onChange={e => updateDay(day, { start: e.target.value })}
                    className="rounded border border-input bg-background px-2 py-1 text-sm"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={schedule[day].end}
                    onChange={e => updateDay(day, { end: e.target.value })}
                    className="rounded border border-input bg-background px-2 py-1 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Day off</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Clock className="h-5 w-5 text-primary" /> Job Preferences
          </h2>
          <div className="flex items-center gap-4">
            <Label className="text-sm text-muted-foreground">Max jobs per day:</Label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setMaxJobs(Math.max(1, maxJobs - 1))}>-</Button>
              <span className="w-8 text-center font-semibold text-foreground">{maxJobs}</span>
              <Button size="sm" variant="outline" onClick={() => setMaxJobs(Math.min(15, maxJobs + 1))}>+</Button>
            </div>
          </div>
        </div>

        <Button className="mt-6 w-full gradient-primary border-0 text-primary-foreground" onClick={() => toast.success('Availability updated!')}>
          Save Schedule
        </Button>
      </Card>
    </div>
  );
};

export default ProviderAvailabilityPage;
