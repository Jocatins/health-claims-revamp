import React, { useRef, useState } from 'react';
import Modal from './Modal';

interface BatchUploadModalProps {
  open: boolean;
  onClose: () => void;
}

const BatchUploadModal: React.FC<BatchUploadModalProps> = ({ open, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Batch Claim" width="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input type="text" placeholder="Claim name" style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        <div
          style={{
            border: dragActive ? '2px solid #217346' : '1px dashed #ccc',
            background: dragActive ? '#e6f4ea' : '#fff',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            marginBottom: 8,
            transition: 'border 0.2s, background 0.2s',
            cursor: 'pointer',
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {selectedFile ? (
            <div style={{ marginBottom: 8 }}>
              <strong>Selected file:</strong> {selectedFile.name}
            </div>
          ) : (
            <span>Drag and drop file here or <span style={{ color: '#217346', textDecoration: 'underline' }}>Browse</span></span>
          )}
        </div>
        <div style={{ background: '#f8f8f8', borderRadius: 8, padding: 16 }}>
          <strong>Requirements</strong>
          <ul style={{ margin: '8px 0 0 16px', color: '#444', fontSize: 14 }}>
            <li>Files must be .CSV, .xsxl</li>
            <li>CSV file should contain the following columns - Enrollee ID, Enrollee Name, etc.</li>
            <li>The order of the columns should be same as the order in which they are listed above with the first row as headers.</li>
          </ul>
          <a href="#" style={{ color: '#217346', textDecoration: 'underline', marginTop: 8, display: 'inline-block' }}>
            Download template Batch Claims
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default BatchUploadModal;
