'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AppLayout } from '@/components/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { users, type AuthUser, ApiError } from '@/lib/api';
import {
  User,
  Mail,
  BookOpen,
  Tag,
  Loader2,
  CheckCircle2,
  Pencil,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INTEREST_OPTIONS = [
  'Technology', 'Design', 'Music', 'Sports', 'Literature',
  'Photography', 'Dance', 'Theatre', 'Entrepreneurship', 'Research',
  'AI/ML', 'Web Dev', 'Gaming', 'Debate', 'Volunteering',
];

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [year, setYear] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    users.me()
      .then((data) => {
        setProfile(data);
        setName(data.name ?? '');
        setBio(data.bio ?? '');
        setYear(data.year?.toString() ?? '');
        setInterests(data.interests ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await users.update({
        name,
        bio: bio || undefined,
        year: year ? parseInt(year) : undefined,
        interests,
      });
      setProfile(updated);
      await refreshUser();
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) setSaveError(err.message);
      else setSaveError('Could not save profile. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    if (!profile) return;
    setName(profile.name ?? '');
    setBio(profile.bio ?? '');
    setYear(profile.year?.toString() ?? '');
    setInterests(profile.interests ?? []);
    setEditing(false);
    setSaveError(null);
  }

  const displayUser = profile ?? user;
  const initials = displayUser?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '??';

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-12 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight mb-1">Profile & Settings</h1>
            <p className="text-[14px] text-ink-muted">Manage your account details and preferences.</p>
          </div>
          {!editing && !loading && (
            <Button 
              variant="secondary"
              onClick={() => setEditing(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Avatar + basic info */}
            <Card className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-[2px] shadow-none bg-surface-1">
              {displayUser?.avatar ? (
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="h-24 w-24 rounded-full border-4 border-canvas object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-surface-2 border-2 border-border flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-ink-muted">{initials}</span>
                </div>
              )}
              <div className="text-center sm:text-left pt-2">
                <h2 className="text-2xl font-bold text-ink tracking-tight">{displayUser?.name}</h2>
                <p className="text-[15px] text-ink-muted mt-1">{displayUser?.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-surface-2 border border-border px-3 py-1 rounded-md text-ink-muted">
                    {displayUser?.role?.replace('_', ' ')}
                  </span>
                  {displayUser?.year && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-surface-2 border border-border px-3 py-1 rounded-md text-ink-muted">
                      Year {displayUser.year}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Success message */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 text-[14px] text-green-700 font-medium"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit form */}
            {editing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <Card className="p-6 md:p-8 border-[2px] shadow-none bg-surface-1">
                  <h3 className="text-lg font-bold text-ink mb-6 pb-4 border-b border-border">
                    Edit Details
                  </h3>

                  {saveError && (
                    <div className="mb-6 border border-red-200 bg-red-50 rounded-lg px-4 py-3 text-[14px] text-red-600 font-medium flex items-center gap-2">
                       <X className="h-4 w-4" /> {saveError}
                    </div>
                  )}

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-ink flex items-center gap-2">
                        Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-ink flex items-center gap-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell your campus a bit about yourself..."
                        rows={3}
                        disabled={saving}
                        className="bg-canvas border border-border rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none disabled:opacity-50"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-ink flex items-center gap-2">
                         Academic Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={saving}
                        className="bg-canvas border border-border rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <option value="">Select year</option>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y}>{y}{['st', 'nd', 'rd', 'th', 'th'][y - 1]} Year</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 mt-2">
                      <label className="text-[13px] font-semibold text-ink flex items-center gap-2">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((interest) => (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            disabled={saving}
                            className={`text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all border ${
                              interests.includes(interest)
                                ? 'border-primary bg-primary text-canvas'
                                : 'border-border bg-surface-1 text-ink-muted hover:border-ink hover:text-ink disabled:opacity-50'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    onClick={cancelEdit} 
                    disabled={saving}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </span>
                    ) : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              /* Read-only view */
              <Card className="p-6 md:p-8 border-[2px] shadow-none bg-surface-1">
                <div className="flex flex-col gap-6">
                  {[
                    { icon: User, label: 'Name', value: displayUser?.name },
                    { icon: Mail, label: 'Email', value: displayUser?.email },
                    { icon: BookOpen, label: 'Year', value: displayUser?.year ? `Year ${displayUser.year}` : '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 w-32 shrink-0 text-ink-muted">
                        <Icon className="h-4 w-4" />
                        <span className="text-[13px] font-semibold">{label}</span>
                      </div>
                      <div className="text-[14px] text-ink">{value || '—'}</div>
                    </div>
                  ))}

                  {/* Bio */}
                  {displayUser?.bio && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pb-4 border-b border-border">
                      <div className="flex items-center gap-2 w-32 shrink-0 text-ink-muted mt-0.5">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-[13px] font-semibold">Bio</span>
                      </div>
                      <div className="text-[14px] text-ink leading-relaxed max-w-xl">{displayUser.bio}</div>
                    </div>
                  )}

                  {/* Interests */}
                  {displayUser?.interests && displayUser.interests.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pt-2">
                      <div className="flex items-center gap-2 w-32 shrink-0 text-ink-muted mt-1">
                        <Tag className="h-4 w-4" />
                        <span className="text-[13px] font-semibold">Interests</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {displayUser.interests.map((interest) => (
                          <span
                            key={interest}
                            className="text-[12px] font-semibold px-3 py-1 rounded-full border border-border bg-surface-2 text-ink-muted"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
