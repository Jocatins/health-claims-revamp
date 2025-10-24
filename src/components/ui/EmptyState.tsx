import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div style={{ textAlign: 'center', padding: '48px 0' }}>
    <div style={{ marginBottom: 16 }}>{icon}</div>
    <h3 className='text-base font-extrabold text-[#525755] mb-2'>{title}</h3>
    <p className={description ? 'text-base font-medium text-[#6b6f80] mb-6' : 'hidden'}>{description}</p>
    {action}
  </div>
);

export default EmptyState;
