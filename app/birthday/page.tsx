'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Calendar, CheckCircle2, AlertCircle, Cake, Star } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { submitBirthday, getUpcomingBirthdays } from '@/lib/supabase';

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

type BirthdayEntry = {
  full_name: string;
  birthday_month: number;
  birthday_day: number;
};

export default function BirthdayPage() {
  const [form, setForm] = useState({
    full_name: '',
    birthday_month: '',
    birthday_day: '',
    birth_year: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<BirthdayEntry[]>([]);

  useEffect(() => {
    getUpcomingBirthdays()
      .then(setUpcomingBirthdays)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.birthday_month || !form.birthday_day) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitBirthday({
        full_name: form.full_name,
        birthday_month: parseInt(form.birthday_month),
        birthday_day: parseInt(form.birthday_day),
        birth_year: form.birth_year ? parseInt(form.birth_year) : undefined,
        phone: form.phone || undefined,
        message: form.message || undefined,
      });
      setStatus('success');
      setForm({ full_name: '', birthday_month: '', birthday_day: '', birth_year: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const today = new Date();
  const thisMonth = today.getMonth() + 1;

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-[#D4AF37]/10 to-transparent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] font-bold uppercase">Community</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight"
          >
            RCC{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#C21818]">
              Birthdays
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-xl"
          >
            Share your birthday with the community. We love celebrating our players! 🎂
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8960C] flex items-center justify-center">
                <Gift size={22} className="text-[#050810]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Add Your Birthday</h2>
                <p className="text-white/50 text-sm">So we can celebrate you!</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-7xl mb-4">🎉</div>
                  <CheckCircle2 size={48} className="text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2">Birthday Saved!</h3>
                  <p className="text-white/60">We'll celebrate you on your special day. 🎂</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-3 glass rounded-full text-white/60 hover:text-white text-sm transition-colors"
                  >
                    Add another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                      Full Name <span className="text-[#C21818]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={e => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Your name as used in RCC"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                        Month <span className="text-[#C21818]">*</span>
                      </label>
                      <select
                        required
                        value={form.birthday_month}
                        onChange={e => setForm({ ...form, birthday_month: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      >
                        <option value="">Month</option>
                        {months.map((m, i) => (
                          <option key={m} value={i + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">
                        Day <span className="text-[#C21818]">*</span>
                      </label>
                      <select
                        required
                        value={form.birthday_day}
                        onChange={e => setForm({ ...form, birthday_day: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      >
                        <option value="">Day</option>
                        {days.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Year (optional)</label>
                      <input
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        value={form.birth_year}
                        onChange={e => setForm({ ...form, birth_year: e.target.value })}
                        placeholder="e.g. 1995"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Phone (optional)</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Birthday Message (optional)</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Something you'd like the community to know on your birthday..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors text-sm resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#C21818]/10 border border-[#C21818]/20 text-[#C21818] text-sm">
                      <AlertCircle size={16} />
                      {errorMsg}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] font-black tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#050810]/30 border-t-[#050810] rounded-full animate-spin" />
                        SAVING...
                      </span>
                    ) : (
                      <>
                        <Cake size={18} />
                        SAVE MY BIRTHDAY
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Upcoming Birthdays sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-6"
        >
          {/* This Month */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={20} className="text-[#D4AF37]" />
              <h3 className="text-white font-black">
                {months[thisMonth - 1]} Birthdays 🎂
              </h3>
            </div>

            {upcomingBirthdays.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎈</div>
                <p className="text-white/40 text-sm">
                  No birthdays registered for this month yet.<br />Be the first!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBirthdays.map((b, i) => {
                  const isToday = b.birthday_day === today.getDate();
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl ${
                        isToday
                          ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#C21818]/10 border border-[#D4AF37]/30'
                          : 'bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        isToday ? 'bg-gradient-to-br from-[#D4AF37] to-[#C21818] text-white' : 'bg-white/10 text-white/60'
                      }`}>
                        {b.birthday_day}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-sm truncate">{b.full_name}</div>
                        <div className="text-white/40 text-xs">{months[b.birthday_month - 1]} {b.birthday_day}</div>
                      </div>
                      {isToday && (
                        <div className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold">
                          <Star size={12} className="fill-current" />
                          TODAY!
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="glass-gold rounded-3xl p-6">
            <div className="text-3xl mb-3">🏸</div>
            <h4 className="text-white font-black mb-2">Why share your birthday?</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              {[
                'Get a community shoutout on your day',
                'Special mention in weekend sessions',
                'Surprise treats from RCC admins',
                'Feel the love from fellow players',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
