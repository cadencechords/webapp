import { useEffect, useRef, type ReactNode } from 'react';

type FadeInProps = {
  children?: ReactNode;
  className?: string;
};

export default function FadeIn({ children, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.classList.toggle('translate-y-6');
      ref.current?.classList.toggle('opacity-0');
    }, 20);
  }, []);

  return (
    <div
      className={`transform translate-y-6 z-10 opacity-0 duration-700 ${className}`}
      ref={ref}
    >
      {children}
    </div>
  );
}
