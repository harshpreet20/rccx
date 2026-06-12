'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { submitJoinRequest } from '@/lib/supabase';

const POPUP_KEY = 'rcc_join_popup_dismissed';

export default function JoinPopup() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    skill_level: 'Beginner',
    message: '',
  });

  useEffect(() => {
    const dismissed = sessionStorage.getItem(POPUP_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(POPUP_KEY, '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.phone) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitJoinRequest({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email || undefined,
        skill_level: form.skill_level,
        message: form.message || undefined,
      });
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try WhatsApp instead.');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-[#050810]/80 backdrop-blur-sm"
          />

          {/* Popup */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#C21818]/20 to-[#D4AF37]/20 blur-xl" />

              <div className="relative glass rounded-3xl overflow-hidden border border-white/10">
                {/* Header band */}
                <div className="bg-gradient-to-r from-[#C21818] to-[#8B0000] px-6 py-5 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                  />
                  <button
                    onClick={dismiss}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <X size={16} className="text-white" />
                  </button>
                  <div className="relative">
                    <div className="text-3xl mb-2">🏸</div>
                    <h2 className="text-white font-black text-xl leading-tight">
                      Join Delhi's Elite<br />Badminton Community
                    </h2>
                    <p className="text-white/70 text-sm mt-1">Invite-only. Serious players. Real community.</p>
                  </div>
                </div>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                      >
                        <div className="text-5xl mb-4">🎉</div>
                        <CheckCircle2 size={40} className="text-[#D4AF37] mx-auto mb-3" />
                        <h3 className="text-xl font-black text-white mb-2">Request Received!</h3>
                        <p className="text-white/60 text-sm mb-4">
                          Our admins will review your request and reach out via WhatsApp.
                        </p>
                        <p className="text-white/40 text-xs">Average response time: 24–48 hours</p>
                        <button
                          onClick={dismiss}
                          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] font-black text-sm rounded-full"
                        >
                          CLOSE
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        {/* Step indicators */}
                        <div className="flex items-center gap-2 mb-2">
                          {[1, 2].map(s => (
                            <div
                              key={s}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                s <= step ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37]' : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>

                        <AnimatePresence mode="wait">
                          {step === 1 && (
                            <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <p className="text-white/50 text-xs tracking-wider uppercase mb-4">Step 1 — Who are you?</p>
                              <div>
                                <label className="block text-white/50 text-xs tracking-widest uppercase mb-1.5">
                                  Full Name <span className="text-[#C21818]">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={form.full_name}
                                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                                  placeholder="Your full name"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-white/50 text-xs tracking-widest uppercase mb-1.5">
                                  WhatsApp Number <span className="text-[#C21818]">*</span>
                                </label>
                                <input
                                  type="tel"
                                  required
                                  value={form.phone}
                                  onChange={e => setForm({ ...form, phone: e.target.value })}
                                  placeholder="+91 XXXXX XXXXX"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                                />
                              </div>
                              <motion.button
                                type="button"
                                onClick={() => {
                                  if (!form.full_name || !form.phone) return;
                                  setStep(2);
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black text-sm tracking-widest rounded-xl"
                              >
                                NEXT <ChevronRight size={16} />
                              </motion.button>
                            </motion.div>
                          )}

                          {step === 2 && (
                            <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <p className="text-white/50 text-xs tracking-wider uppercase mb-4">Step 2 — Your game</p>
                              <div>
                                <label className="block text-white/50 text-xs tracking-widest uppercase mb-1.5">Skill Level</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(level => (
                                    <button
                                      key={level}
                                      type="button"
                                      onClick={() => setForm({ ...form, skill_level: level })}
                                      className={`py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        form.skill_level === level
                                          ? 'bg-gradient-to-r from-[#C21818] to-[#D4AF37] text-white'
                                          : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                      }`}
                                    >
                                      {level}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-white/50 text-xs tracking-widest uppercase mb-1.5">Why do you want to join? (optional)</label>
                                <textarea
                                  rows={2}
                                  value={form.message}
                                  onChange={e => setForm({ ...form, message: e.target.value })}
                                  placeholder="Tell us a bit about yourself..."
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm resize-none"
                                />
                              </div>

                              {status === 'error' && (
                                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#C21818]/10 border border-[#C21818]/20 text-[#C21818] text-xs">
                                  <AlertCircle size={14} />
                                  {errorMsg}
                                </div>
                              )}

                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => setStep(1)}
                                  className="px-4 py-3 glass rounded-xl text-white/50 text-sm hover:text-white transition-colors"
                                >
                                  ← Back
                                </button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  type="submit"
                                  disabled={status === 'loading'}
                                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black text-sm tracking-widest rounded-xl disabled:opacity-60"
                                >
                                  {status === 'loading' ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <Zap size={14} className="fill-current" />
                                      REQUEST TO JOIN
                                    </>
                                  )}
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Divider */}
                        <div className="flex items-center gap-3 py-1">
                          <div className="h-px flex-1 bg-white/5" />
                          <span className="text-white/30 text-xs">or</span>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <a
                          href="https://chat.whatsapp.com/KeznsK95pHK1JKT4nqpcsv"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold text-sm rounded-xl hover:bg-[#25D366]/20 transition-all"
                        >
                          Join via WhatsApp directly
                        </a>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
