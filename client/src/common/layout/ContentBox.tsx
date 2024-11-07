import { ReactNode } from 'react';
interface classProps {
  class?: string;
  children: ReactNode;
}

export default function ContentBox(prop: classProps) {
  return (
    <div className={`bg-white p-3 rounded-lg ${prop.class}`}>
      {prop.children}
    </div>
  );
}
