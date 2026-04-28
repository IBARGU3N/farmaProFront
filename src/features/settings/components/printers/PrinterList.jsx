import React from 'react';
import PrinterOption from './PrinterOption';

export default function PrinterList({ printers, selectedId, onSelect }) {
  return (
    <div>
      {printers.map((p) => (
        <PrinterOption
          key={p.id}
          printer={p}
          checked={selectedId === p.id}
          onChange={onSelect}
        />
      ))}
    </div>
  );
}
