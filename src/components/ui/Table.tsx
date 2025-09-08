import React from 'react';
import TableHeaderCell from './TableHeaderCell';

interface TableProps {
  headers: Array<string | React.ReactNode>;
  rows: Array<Array<React.ReactNode>>;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  tableStyle?: React.CSSProperties;
}

const Table: React.FC<TableProps> = ({ headers, rows, headerStyle, rowStyle, tableStyle }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', ...tableStyle }}>
    <thead>
      <tr style={{ background: '#e4f7f0' }}>
        {headers.map((header, idx) => (
          <TableHeaderCell key={idx} style={{ padding: 8, ...headerStyle }}>
            {header}
          </TableHeaderCell>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rIdx) => (
        <tr key={rIdx} style={rowStyle}>
          {row.map((cell, cIdx) => (
            <td key={cIdx} style={{ padding: 8 }}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
