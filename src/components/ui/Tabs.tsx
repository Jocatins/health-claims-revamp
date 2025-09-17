import React, { useEffect, useRef, useState } from 'react';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  variant?: 'underline' | 'boxed';
}

const Tabs: React.FC<TabsProps> = ({ items, activeKey, onChange, className='', variant='underline' }) => {
  const containerRef = useRef<HTMLDivElement|null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{width:number; left:number}>({ width:0, left:0 });

  useEffect(() => {
    if (variant !== 'underline') return;
    const container = containerRef.current;
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll('button[data-tab-key]')) as HTMLButtonElement[];
    const activeBtn = buttons.find(b => b.dataset.tabKey === activeKey);
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeKey, items, variant]);

  return (
    <div className={className}>
      <div ref={containerRef} className="relative flex border-b gap-8 px-1">
        {items.map(it => {
          const active = it.key === activeKey;
          return (
            <button
              key={it.key}
              data-tab-key={it.key}
              onClick={() => onChange(it.key)}
              className={`relative transition-colors pb-3 pt-2 font-avenir text-[18px] ${
                active
                  ? 'text-primary font-extrabold leading-6'
                  : 'text-[#525755] font-medium leading-6 tracking-tightpx hover:text-primary'
              }`}
            >
              {it.label}
            </button>
          );
        })}
        {variant==='underline' && (
          <span
            className="pointer-events-none absolute bottom-0 h-[3px] bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: indicatorStyle.width, left: indicatorStyle.left }}
          />
        )}
      </div>
      <div className="pt-6 px-8 mt-10">
        {items.find(i => i.key === activeKey)?.content}
      </div>
    </div>
  );
};

export default Tabs;
