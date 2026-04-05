import { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const CsvUpload = ({ onUpload }) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [message, setMessage] = useState('');

    const parseCSV = (text) => {
        const lines = text.split('\n');
        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

        // Basic validation
        const required = ['date', 'title', 'amount'];
        const missing = required.filter(r => !headers.some(h => h.includes(r)));

        if (missing.length > 0) {
            throw new Error(`Missing columns: ${missing.join(', ')}`);
        }

        const newTransactions = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');

            // Simple mapping based on index (assuming order for simplicity if headers match loosely, 
            // real app would map by index of header)
            // For this demo, let's assume standard order or map dynamically

            const row = {};
            headers.forEach((header, index) => {
                // clean quotes
                let val = values[index]?.trim().replace(/^"|"$/g, '');
                if (header.includes('date')) row.date = val;
                else if (header.includes('time')) row.time = val;
                else if (header.includes('title')) row.title = val;
                else if (header.includes('category')) row.category = val;
                else if (header.includes('amount')) row.amount = parseFloat(val);
            });

            if (row.date && row.title && row.amount) {
                newTransactions.push({
                    ...row,
                    id: Date.now() + i,
                    category: row.category || 'Uncategorized', // default
                    time: row.time || '00:00'
                });
            }
        }

        return newTransactions;
    };

    const processFile = (file) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            setStatus('error');
            setMessage('Please upload a CSV file.');
            return;
        }

        setStatus('processing');
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = parseCSV(e.target.result);
                onUpload(data, file); // content, file
                setStatus('success');
                setMessage(`Successfully added ${data.length} transactions.`);
                setTimeout(() => {
                    setStatus('idle');
                    setMessage('');
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Failed to parse CSV.');
            }
        };

        reader.readAsText(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 transition-all cursor-pointer group h-full min-h-[300px]
        ${dragActive ? 'border-accent bg-accent/5' : 'border-glass-border hover:border-accent/50'}
        ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
        ${status === 'success' ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
        `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
            />

            {status === 'success' ? (
                <div className="text-emerald-400 animate-in fade-in zoom-in">
                    <CheckCircle className="w-12 h-12 mb-3 mx-auto" />
                    <p className="font-bold">Upload Complete!</p>
                    <p className="text-sm opacity-80">{message}</p>
                </div>
            ) : status === 'error' ? (
                <div className="text-red-400 animate-in fade-in zoom-in">
                    <AlertCircle className="w-12 h-12 mb-3 mx-auto" />
                    <p className="font-bold">Upload Failed</p>
                    <p className="text-sm opacity-80">{message}</p>
                </div>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className={`w-8 h-8 text-slate-400 transition-colors ${dragActive ? 'text-accent' : 'group-hover:text-accent'}`} />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">Upload CSV File</h3>
                    <p className="text-slate-400 text-sm mb-6 max-w-xs">
                        {dragActive ? 'Drop file here...' : 'Drag & drop your bank statement or expense CSV here.'}
                    </p>

                    <div className="flex flex-col gap-2 text-xs text-slate-500 bg-white/5 p-4 rounded-xl text-left w-full max-w-[280px]">
                        <p className="font-medium text-slate-300 mb-1">Required Columns:</p>
                        <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Date, Time</div>
                        <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Title, Category</div>
                        <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Amount</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CsvUpload;
