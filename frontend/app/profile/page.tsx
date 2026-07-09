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
      <div className="max-w-2xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent-gold rounded-full" />
            <h1 className="text-[32px] font-playfair font-bold tracking-tight text-ink mb-1">Profile</h1>
            <p className="text-[15px] font-medium text-ink-muted">Your account details and preferences.</p>
          </div>
          {!editing && !loading && (
            <button 
              className="bg-surface-2 border border-border/80 text-ink px-5 py-2.5 rounded-full font-semibold text-[14px] hover:border-accent-gold/50 hover:bg-surface-1 transition-all shadow-sm flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent-gold/60" />
          </div>
        ) : (
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="flex flex-col gap-8"
          >
            {/* Avatar + basic info */}
            <div className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[24px] shadow-sm p-8 flex items-center gap-8 relative overflow-hidden group">
               {/* Decorative background glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-gold/5 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:bg-accent-gold/10" />
              
              {displayUser?.avatar ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-gold/20 blur-md rounded-full" />
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="h-24 w-24 rounded-full border-4 border-canvas object-cover relative z-10 shadow-soft"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-gold/30 blur-md rounded-full" />
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-accent-gold to-accent-orange border-4 border-canvas flex items-center justify-center relative z-10 shadow-soft">
                    <span className="text-[32px] font-playfair font-bold text-canvas">{initials}</span>
                  </div>
                </div>
              )}
              <div className="relative z-10">
                <h2 className="text-[28px] font-playfair font-bold text-ink tracking-tight mb-1">{displayUser?.name}</h2>
                <p className="text-[15px] font-medium text-ink-muted">{displayUser?.email}</p>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider border border-accent-gold/30 bg-accent-gold/5 px-3 py-1.5 rounded-full text-accent-gold">
                    {displayUser?.role?.replace('_', ' ')}
                  </span>
                  {displayUser?.year && (
                    <span className="text-[13px] font-semibold text-ink-muted bg-surface-1 px-3 py-1.5 rounded-full border border-border/60">
                      Year {displayUser.year}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Success message */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 bg-accent-teal/10 border border-accent-teal/20 rounded-2xl p-4 text-[14px] text-accent-teal font-semibold shadow-sm overflow-hidden"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Profile updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Edit form */}
            {editing ? (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSave} 
                className="flex flex-col gap-6"
              >
                <div className="bg-surface-2/40 backdrop-blur-sm border border-border/60 rounded-[24px] shadow-sm p-8">
                  <h3 className="text-[18px] font-playfair font-bold text-ink mb-6 pb-4 border-b border-border/50">
                    Edit Details
                  </h3>

                  {saveError && (
                    <div className="mb-6 border border-red-500/20 bg-red-500/10 rounded-xl px-4 py-3 text-[14px] text-red-400 font-semibold flex items-center gap-2">
                       <X className="h-4 w-4" /> {saveError}
                    </div>
                  )}

                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-semibold text-ink-muted flex items-center gap-2">
                        <User className="h-4 w-4 text-accent-gold" />
                        Full Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        disabled={saving}
                        className="bg-surface-1 border border-border/80 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all disabled:opacity-50"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-semibold text-ink-muted flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-accent-gold" />
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell your campus a bit about yourself..."
                        rows={3}
                        disabled={saving}
                        className="bg-surface-1 border border-border/80 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all resize-none disabled:opacity-50"
                      />
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <label className="text-[13px] font-semibold text-ink-muted flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4 text-accent-gold" /> Academic Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={saving}
                        className="bg-surface-1 border border-border/80 rounded-xl px-4 py-3.5 text-[15px] font-medium text-ink focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="">Select year</option>
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y}>{y}{['st', 'nd', 'rd', 'th', 'th'][y - 1]} Year</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-[13px] font-semibold text-ink-muted flex items-center gap-2">
                        <Tag className="h-4 w-4 text-accent-gold" />
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {INTEREST_OPTIONS.map((interest) => (
                          <button
                            type="button"
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            disabled={saving}
                            className={`text-[12px] font-semibold px-4 py-2 rounded-full transition-all border ${
                              interests.includes(interest)
                                ? 'border-accent-gold/50 bg-accent-gold/10 text-accent-gold shadow-sm'
                                : 'border-border/60 bg-surface-1 text-ink-muted hover:border-accent-gold/30 hover:text-ink disabled:opacity-50'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-ink text-canvas hover:bg-ink/90 px-6 py-4 rounded-xl font-bold text-[15px] transition-all shadow-md disabled:opacity-70 flex justify-center items-center" 
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </span>
                    ) : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEdit} 
                    disabled={saving}
                    className="px-6 py-4 rounded-xl font-bold text-[15px] bg-surface-2 border border-border/80 text-ink hover:bg-surface-1 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            ) : (
              /* Read-only view */
              <div className="bg-surface-2/40 backdrop-blur-sm border border-border/60 rounded-[24px] shadow-sm p-8">
                <div className="flex flex-col gap-6">
                  {[
                    { icon: User, label: 'Name', value: displayUser?.name },
                    { icon: Mail, label: 'Email', value: displayUser?.email },
                    { icon: BookOpen, label: 'Year', value: displayUser?.year ? `Year ${displayUser.year}` : '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4 pb-6 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="h-4 w-4 text-accent-gold" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-1.5">{label}</p>
                        <p className="text-[15px] font-medium text-ink">{value || '—'}</p>
                      </div>
                    </div>
                  ))}

                  {/* Bio */}
                  {displayUser?.bio && (
                    <div className="flex items-start gap-4 pb-6 border-b border-border/40">
                      <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                        <BookOpen className="h-4 w-4 text-accent-gold" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-2">Bio</p>
                        <p className="text-[15px] font-medium text-ink-muted leading-relaxed max-w-xl">{displayUser.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Interests */}
                  {displayUser?.interests && displayUser.interests.length > 0 && (
                    <div className="flex items-start gap-4 pt-2">
                      <div className="h-10 w-10 rounded-full bg-surface-1 border border-border/60 flex items-center justify-center shrink-0 shadow-sm">
                        <Tag className="h-4 w-4 text-accent-gold" />
                      </div>
                      <div className="pt-0.5 w-full">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted mb-3">Interests</p>
                        <div className="flex flex-wrap gap-2.5">
                          {displayUser.interests.map((interest) => (
                            <span
                              key={interest}
                              className="text-[12px] font-semibold px-4 py-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/5 text-accent-gold"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
