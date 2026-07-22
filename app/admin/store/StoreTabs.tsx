'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/admin/store', label: 'Orders' },
  { href: '/admin/store/products', label: 'Products' },
  { href: '/admin/store/discounts', label: 'Discounts' },
  { href: '/admin/store/settings', label: 'Settings' },
];

export default function StoreTabs() {
  const pathname = usePathname();
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {TABS.map((tab) => {
        const active = tab.href === '/admin/store' ? pathname === tab.href : pathname?.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} style={{
            padding: '10px 16px', textDecoration: 'none',
            fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: active ? '#C21818' : 'rgba(255,255,255,0.4)',
            borderBottom: active ? '2px solid #C21818' : '2px solid transparent',
            marginBottom: -1,
          }}>
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
