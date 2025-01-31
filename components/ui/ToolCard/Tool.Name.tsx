import mergeTW from '@/utils/mergeTW';
import { ReactNode } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export default ({ className, children, href }: { className?: string; href: string; children?: ReactNode }) => (
  <h3 className={mergeTW(`text-slate-100 font-medium flex gap-x-3 items-center ${className}`)}>
    {children}
    <a id="tool-title" href={href} onClick={() => window.open(href)} target="_blank" className="hidden group-hover/card:block">
      <ArrowTopRightOnSquareIcon className="w-4 h-4 pointer-events-none" />
    </a>
  </h3>
);
