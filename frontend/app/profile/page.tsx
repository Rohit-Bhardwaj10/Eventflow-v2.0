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
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline text-ink mb-1">Profile</h1>
            <p className="text-sm text-ink-muted">Your account details and preferences.</p>
          </div>
          {!editing && !loading && (
            <Button variant="secondary" size="default" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Profile
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Avatar + basic info */}
            <div className="border-[2px] border-border bg-surface-1 shadow-brutal p-6 flex items-center gap-6">
              {displayUser?.avatar ? (
                <img
                  src={displayUser.avatar}
                  alt={displayUser.name}
                  className="h-20 w-20 rounded-full border-[2px] border-border object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary border-[2px] border-border flex items-center justify-center">
                  <span className="text-2xl font-black text-ink">{initials}</span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-black uppercase text-ink">{displayUser?.name}</h2>
                <p className="text-sm text-ink-muted mt-1">{displayUser?.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] border border-border px-2 py-1 text-primary">
                    {displayUser?.role?.replace('_', ' ')}
                  </span>
                  {displayUser?.year && (
                    <span className="text-[10px] text-ink-muted">Year {displayUser.year}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Success message */}
            {saveSuccess && (
              <div className="flex items-center gap-2 border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Profile updated successfully!
              </div>
            )}

            {/* Edit form */}
            {editing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-6">
                <Card variant="default">
                  <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink mb-5 pb-3 border-b border-border">
                    Edit Profile
                  </h3>

                  {saveError && (
                    <div className="mb-4 border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-400 font-semibold">
                      {saveError}
                    </div>
                  )}

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-caption text-ink flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-primary" />
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
                      <label className="text-caption text-ink flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell your campus a bit about yourself..."
                        rows={3}
                        disabled={saving}
                        className="border-[2px] border-border bg-canvas text-ink px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-caption text-ink">Academic Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={saving}
                        className="border-[2px] border-border bg-canvas text-ink px-4 py-3 text-sm font-semibold focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select year</option>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y}>{y}{['st', 'nd', 'rd', 'th', 'th'][y - 1]} Year</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-caption text-ink flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((interest) => (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            disabled={saving}
                            className={`text-[11px] font-black uppercase tracking-[0.12em] border-[2px] px-3 py-1.5 transition-colors ${
                              interests.includes(interest)
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border text-ink-muted hover:border-primary/50 hover:text-ink'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="primary" size="lg" className="flex-1" disabled={saving}>
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </span>
                    ) : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" size="lg" type="button" onClick={cancelEdit} disabled={saving}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              /* Read-only view */
              <Card variant="default">
                <div className="flex flex-col gap-5">
                  {[
                    { icon: User, label: 'Name', value: displayUser?.name },
                    { icon: Mail, label: 'Email', value: displayUser?.email },
                    { icon: BookOpen, label: 'Year', value: displayUser?.year ? `Year ${displayUser.year}` : '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="h-8 w-8 border border-border flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink-muted mb-0.5">{label}</p>
                        <p className="text-sm font-semibold text-ink">{value || '—'}</p>
                      </div>
                    </div>
                  ))}

                  {/* Bio */}
                  {displayUser?.bio && (
                    <div className="flex items-start gap-3 pb-4 border-b border-border/50">
                      <div className="h-8 w-8 border border-border flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink-muted mb-0.5">Bio</p>
                        <p className="text-sm text-ink-muted leading-6">{displayUser.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {displayUser?.interests && displayUser.interests.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 border border-border flex items-center justify-center shrink-0">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-ink-muted mb-2">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {displayUser.interests.map((interest) => (
                            <span
                              key={interest}
                              className="text-[11px] font-black uppercase tracking-[0.12em] border border-primary/40 px-2 py-1 text-primary"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
