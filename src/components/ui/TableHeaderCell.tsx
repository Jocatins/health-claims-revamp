import React from 'react';

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, className = '', style }) => (
  <th className={`text-sm font-extrabold text-[#6b6f80] ${className}`} style={style}>
    {children}
  </th>
);

export default TableHeaderCell;
