'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Zap, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { submitMemberOnboarding } from '@/lib/supabase';
import { SOCIAL_LINKS } from '@/lib/utils';

const steps = [
  { label: 'About You', icon: '👤' },
  { label: 'Your Game', icon: '🏸' },
  { label: 'Community', icon: '🤝' },
];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
const courtPreferences = ['Siri Fort Sports Complex', 'Yamuna Sports Complex', 'Any available', 'No preference'];
const howHeardOptions = ['WhatsApp', 'Instagram', 'Friend/Player referral', 'Google Search', 'Other'];

type FormData = {
  full_name: string;
  phone: string;
  email: string;
  birthday: string;
  skill_level: string;
  years_playing: string;
  court_preference: string;
  how_heard: string;
  agree_guidelines: boolean;
};

export default function JoinPage() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState<FormData>({
    full_name: '',
    phone: '',
    email: '',
    birthday: '',
    skill_level: 'Beginner',
    years_playing: '0',
    court_preference: 'No preference',
    how_heard: '',
    agree_guidelines: false,
  });

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.agree_guidelines) {
      setErrorMsg('Please agree to the community guidelines to proceed.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitMemberOnboarding({
        full_name: form.full_name,
        phone: form.phone || undefined,
        email: form.email || undefined,
        birthday: form.birthday || undefined,
        skill_level: form.skill_level,
        court_preference: form.court_preference,
        years_playing: parseInt(form.years_playing) || 0,
        how_heard: form.how_heard || undefined,
        agree_guidelines: form.agree_guidelines,
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or join via WhatsApp.');
    }
  };

  const canNext = () => {
    if (step === 0) return !!form.full_name && !!form.phone;
    if (step === 1) return !!form.skill_level;
    return true;
  };

  return (
    <div className="pt-24 min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#C21818]/8 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C21818]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Member Onboarding</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C21818]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight"
          >
            Join{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C21818] to-[#D4AF37]">RCC</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/60"
          >
            Complete your onboarding to become an RCC community member.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-12 text-center"
            >
              <div className="text-7xl mb-4">🎉</div>
              <CheckCircle2 size={56} className="text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-3">Welcome to RCC!</h2>
              <p className="text-white/60 mb-2">Your onboarding request has been submitted.</p>
              <p className="text-white/40 text-sm mb-8">Our admins will review your profile and reach out on WhatsApp within 24–48 hours.</p>
              <div className="space-y-3">
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black tracking-widest rounded-full"
                >
                  <MessageCircle size={18} />
                  JOIN WHATSAPP COMMUNITY
                </a>
                <a
                  href="/birthday"
                  className="flex items-center justify-center w-full py-3 glass text-white/60 hover:text-white text-sm rounded-full transition-colors"
                >
                  🎂 Also add your birthday →
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl overflow-hidden"
            >
              {/* Step progress bar */}
              <div className="px-8 pt-8 pb-4">
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className={`flex items-center gap-2 ${i <= step ? 'text-white' : 'text-white/30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                          i < step
                            ? 'bg-gradient-to-br from-[#C21818] to-[#D4AF37] text-white'
                            : i === step
                            ? 'bg-white/10 border border-[#D4AF37] text-white'
                            : 'bg-white/5 text-white/30'
                        }`}>
                          {i < step ? '✓' : i + 1}
                        </div>
                        <span className="text-xs font-bold tracking-wider hidden sm:block">{s.label}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`h-px flex-1 transition-all duration-500 ${i < step ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37]' : 'bg-white/10'}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{steps[step].icon}</span>
                  <h3 className="text-lg font-black text-white">{steps[step].label}</h3>
                </div>
              </div>

              <div className="px-8 pb-8">
                <AnimatePresence mode="wait">
                  {/* ─── STEP 1: About You ─── */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                          Full Name <span className="text-[#C21818]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.full_name}
                          onChange={e => set('full_name', e.target.value)}
                          placeholder="Your full name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                          WhatsApp Number <span className="text-[#C21818]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Email (optional)</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => set('email', e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                          Birthday 🎂 (optional)
                        </label>
                        <input
                          type="date"
                          value={form.birthday}
                          onChange={e => set('birthday', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                        />
                        <p className="text-white/30 text-xs mt-1">We'll celebrate you on your special day!</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── STEP 2: Your Game ─── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-3">
                          Skill Level <span className="text-[#C21818]">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {skillLevels.map(level => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => set('skill_level', level)}
                              className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                                form.skill_level === level
                                  ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37] text-white shadow-[0_0_20px_rgba(194,24,24,0.3)]'
                                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                          Years Playing Badminton
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={form.years_playing}
                          onChange={e => set('years_playing', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-3">Court Preference</label>
                        <div className="space-y-2">
                          {courtPreferences.map(court => (
                            <button
                              key={court}
                              type="button"
                              onClick={() => set('court_preference', court)}
                              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                                form.court_preference === court
                                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]'
                                  : 'bg-white/5 text-white/50 hover:bg-white/8 border border-transparent'
                              }`}
                            >
                              {form.court_preference === court ? '✓ ' : ''}{court}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ─── STEP 3: Community ─── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-white/50 text-xs tracking-widest uppercase mb-3">How did you hear about RCC?</label>
                        <div className="grid grid-cols-2 gap-2">
                          {howHeardOptions.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => set('how_heard', option)}
                              className={`py-3 px-3 rounded-xl text-sm transition-all duration-200 text-left ${
                                form.how_heard === option
                                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-bold'
                                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Guidelines agreement */}
                      <div className="glass-gold rounded-2xl p-5">
                        <h4 className="text-white font-black mb-3 text-sm">Community Guidelines</h4>
                        <ul className="space-y-1.5 text-white/60 text-xs mb-4">
                          {[
                            'Respectful conduct is mandatory at all times',
                            'No spamming, harassment, or unauthorized promotions',
                            'Advance payment required for session slots',
                            'Late cancellations are payable',
                            'Any rivalries must be disclosed to admins',
                          ].map(g => (
                            <li key={g} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] flex-shrink-0">✓</span>
                              {g}
                            </li>
                          ))}
                        </ul>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div
                            onClick={() => set('agree_guidelines', !form.agree_guidelines)}
                            className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-200 border ${
                              form.agree_guidelines
                                ? 'bg-gradient-to-br from-[#C21818] to-[#D4AF37] border-transparent'
                                : 'bg-white/5 border-white/20 group-hover:border-white/40'
                            }`}
                          >
                            {form.agree_guidelines && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className="text-white/70 text-sm leading-relaxed">
                            I have read and agree to the{' '}
                            <a href="/guidelines" target="_blank" className="text-[#D4AF37] hover:underline">
                              RCC Community Guidelines
                            </a>{' '}
                            and commit to upholding them.
                          </span>
                        </label>
                      </div>

                      {status === 'error' && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#C21818]/10 border border-[#C21818]/20 text-[#C21818] text-sm">
                          <AlertCircle size={16} />
                          {errorMsg}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(s => (s - 1) as 0 | 1 | 2)}
                      className="flex items-center gap-2 px-5 py-3.5 glass rounded-xl text-white/60 hover:text-white text-sm font-bold transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Back
                    </button>
                  )}

                  {step < steps.length - 1 ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: canNext() ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => canNext() && setStep(s => (s + 1) as 0 | 1 | 2)}
                      disabled={!canNext()}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black text-sm tracking-widest rounded-xl disabled:opacity-40 transition-opacity"
                    >
                      NEXT <ChevronRight size={16} />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={status === 'loading' || !form.agree_guidelines}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#C21818] to-[#D4AF37] text-white font-black text-sm tracking-widest rounded-xl disabled:opacity-40"
                    >
                      {status === 'loading' ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Zap size={16} className="fill-current" />
                          SUBMIT & JOIN RCC
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
