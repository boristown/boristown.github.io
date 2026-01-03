import React, { useState, useRef, useCallback } from 'react';
import { ConversionStatus } from '../types';
import { readFileAsText, convertTextToZipBlob, downloadBlob, getZipFileList } from '../utils/fileProcessing';
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertCircleIcon, ZipIcon, DocumentIcon } from './Icons';

export const Converter: React.FC = () => {
  const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // State for preview
  const [previewFiles, setPreviewFiles] = useState<string[]>([]);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStatus(ConversionStatus.IDLE);
    setFileName('');
    setErrorMsg('');
    setPreviewFiles([]);
    setGeneratedBlob(null);
    setOutputFileName('');
  };

  const processFile = async (file: File) => {
    if (!file) return;

    // We no longer strictly validate .txt extension. 
    // Any file is accepted and treated as text.
    
    setStatus(ConversionStatus.PROCESSING);
    
    // Virtual suffix logic: If it doesn't end in .txt, append it for display
    let displayFileName = file.name;
    if (!displayFileName.toLowerCase().endsWith('.txt')) {
      displayFileName += '.txt';
    }
    setFileName(displayFileName);
    
    setErrorMsg('');
    setPreviewFiles([]);
    setGeneratedBlob(null);

    try {
      // Small delay to allow UI to update (for better UX)
      await new Promise(resolve => setTimeout(resolve, 600));

      const textContent = await readFileAsText(file);
      const zipBlob = convertTextToZipBlob(textContent);
      
      const timestamp = Date.now();
      const outputName = `${timestamp}.zip`;

      // Instead of downloading immediately, parse content and show preview
      const files = await getZipFileList(zipBlob);
      
      setGeneratedBlob(zipBlob);
      setOutputFileName(outputName);
      setPreviewFiles(files);
      setStatus(ConversionStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(ConversionStatus.ERROR);
      setErrorMsg(err.message || "An unexpected error occurred during conversion.");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (generatedBlob && outputFileName) {
      downloadBlob(generatedBlob, outputFileName);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      resetState();
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      resetState();
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (status === ConversionStatus.SUCCESS || status === ConversionStatus.ERROR) {
      // If clicking the container in success/error state (outside of buttons), don't do anything
      return; 
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative group
          bg-white rounded-2xl shadow-xl border-2 
          transition-all duration-300 ease-in-out
          ${status === ConversionStatus.IDLE ? 'cursor-pointer' : ''}
          ${dragActive ? 'border-brand-500 bg-brand-50 scale-[1.02]' : 'border-slate-100'}
          ${status === ConversionStatus.IDLE && !dragActive ? 'hover:border-brand-300' : ''}
          ${status === ConversionStatus.ERROR ? 'border-red-200' : ''}
          ${status === ConversionStatus.SUCCESS ? 'border-green-200' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={status === ConversionStatus.IDLE ? onButtonClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          // accept=".txt"  <-- Removed to support all files
          className="hidden"
          onChange={handleChange}
        />

        <div className={`p-8 md:p-10 flex flex-col items-center justify-center text-center ${status === ConversionStatus.SUCCESS ? 'min-h-[auto]' : 'min-h-[320px]'}`}>
          
          {/* IDLE STATE */}
          {status === ConversionStatus.IDLE && (
            <>
              <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <UploadIcon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload your file</h3>
              <p className="text-slate-500 mb-6 max-w-xs">
                Drag & drop or click to browse. We will process it as a text file.
              </p>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                Supported: All Files (read as Text)
              </span>
            </>
          )}

          {/* PROCESSING STATE */}
          {status === ConversionStatus.PROCESSING && (
            <>
              <div className="relative w-20 h-20 mb-6">
                 <div className="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Converting...</h3>
              <p className="text-slate-500 mb-2">{fileName}</p>
              <p className="text-xs text-brand-600 animate-pulse">Reversing text & Decoding Base64</p>
            </>
          )}

          {/* SUCCESS STATE */}
          {status === ConversionStatus.SUCCESS && (
            <div className="w-full">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Conversion Ready</h3>
                <p className="text-slate-500 text-sm mt-1">Found {previewFiles.length} file{previewFiles.length !== 1 ? 's' : ''} in the archive.</p>
              </div>

              {/* File Preview List */}
              <div className="w-full bg-slate-50 rounded-xl border border-slate-200 mb-6 overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Zip Contents
                </div>
                <ul className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {previewFiles.length > 0 ? (
                    previewFiles.map((file, idx) => (
                      <li key={idx} className="px-4 py-3 flex items-center text-left hover:bg-slate-100 transition-colors">
                        <DocumentIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate font-medium">{file}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 text-slate-400 text-sm italic">
                      No files detected or unable to read directory.
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
                <button 
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-100 active:scale-95 transform duration-150"
                >
                  <ZipIcon className="w-5 h-5 mr-2" />
                  Download ZIP
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    resetState();
                  }}
                  className="flex-1 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {status === ConversionStatus.ERROR && (
            <>
               <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <AlertCircleIcon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Conversion Failed</h3>
              <p className="text-red-500 mb-6 max-w-xs">
                {errorMsg}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  resetState();
                }}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>

      {/* Helper info text */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-brand-500 font-bold text-lg mb-1">1. Reverse</div>
            <p className="text-xs text-slate-500">Reorders split text lines from bottom to top.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-brand-500 font-bold text-lg mb-1">2. Decode</div>
            <p className="text-xs text-slate-500">Decodes the combined Base64 string to binary.</p>
        </div>
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-brand-500 font-bold text-lg mb-1">3. Preview & Zip</div>
            <p className="text-xs text-slate-500">Preview file list and download as [timestamp].zip.</p>
        </div>
      </div>
    </div>
  );
};