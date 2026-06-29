'use client';

interface SoftAuroraProps {
  className?: string;
}

export function SoftAurora({ className = '' }: SoftAuroraProps) {
  return (
    <>
      <style>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(5%, -8%) scale(1.1); }
          66% { transform: translate(-3%, 5%) scale(0.95); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-6%, 4%) scale(1.05); }
          66% { transform: translate(4%, -6%) scale(1.1); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(3%, 6%) scale(0.9); }
          66% { transform: translate(-5%, -4%) scale(1.05); }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
        className={className}
        aria-hidden="true"
      >
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '45%',
            height: '60%',
            background: 'radial-gradient(ellipse at center, #C9A84C 0%, transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.07,
            animation: 'aurora1 45s ease-in-out infinite alternate',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            width: '40%',
            height: '50%',
            background: 'radial-gradient(ellipse at center, #DC143C 0%, transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.07,
            animation: 'aurora2 60s ease-in-out infinite alternate',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '30%',
            width: '50%',
            height: '45%',
            background: 'radial-gradient(ellipse at center, #4B0082 0%, transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.07,
            animation: 'aurora3 30s ease-in-out infinite alternate',
          }}
        />
      </div>
    </>
  );
}
