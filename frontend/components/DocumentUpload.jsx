"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';

const documentTypes = [
    { id: 'aadhaar-front', label: 'Aadhaar Card (Front)' },
    { id: 'pan-front', label: 'PAN Card (Front)' },
    { id: 'tax-papers', label: 'Income Tax Documents' },
];

export default function DocumentUpload({ onClose, onComplete }) {
    const initialDocs = Object.fromEntries(
        documentTypes.map(({ id }) => [id, { file: null, preview: null, uploaded: false, processing: false, verified: false, error: null }])
    );

    const [documents, setDocuments] = useState(initialDocs);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const allVerified = Object.values(documents).every(doc => doc.verified);

    const handleFileChange = async (e, id) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'image/png') return;

        const preview = URL.createObjectURL(file);
        setDocuments(prev => ({ ...prev, [id]: { ...prev[id], file, preview, uploaded: true, processing: true } }));

        try {
            const text = await extractTextFromImage(file);
            setDocuments(prev => ({ ...prev, [id]: { ...prev[id], processing: false, verified: true, text } }));
        } catch {
            setDocuments(prev => ({ ...prev, [id]: { ...prev[id], processing: false, verified: false, error: 'OCR failed. Upload a clearer image.' } }));
        }
    };

    const extractTextFromImage = (file) => {
        return new Promise((resolve, reject) => {
            Tesseract.recognize(
                file,
                'eng+hin+tam', // Languages to recognize
                'eng',
                { logger: m => console.log(m) } // Logs progress
            )
                .then(({ data: { text } }) => {
                    console.log(`Extracted Text from ${file.name}:\n------------------\n${text.trim()}\n------------------`);
                    resolve(text.trim());
                })
                .catch(error => reject(error));
        });
    };

    useEffect(() => () => Object.values(documents).forEach(doc => doc.preview && URL.revokeObjectURL(doc.preview)), []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex justify-between">
                <h1 className="text-2xl font-bold">Document Upload</h1>
                <button onClick={onClose} className="text-white hover:bg-blue-700 p-2 rounded-full focus:outline-none">
                    &#x2715;
                </button>
            </div>
            <div className="p-6 space-y-6">
                {documentTypes.map(({ id, label }) => (
                    <motion.div key={id} layout className={`border p-4 rounded-lg ${documents[id].processing ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-blue-700">{label}</h2>
                            <label className={`cursor-pointer px-4 py-2 rounded-lg text-white ${documents[id].processing ? 'bg-gray-400' : documents[id].verified ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                {documents[id].uploaded ? (documents[id].verified ? 'Replace' : 'Try Again') : 'Upload'}
                                <input type="file" accept="image/png" className="hidden" onChange={e => handleFileChange(e, id)} disabled={documents[id].processing} />
                            </label>
                        </div>
                        <AnimatePresence>
                            {documents[id].error && <motion.div className="mt-2 text-red-500 text-sm">{documents[id].error}</motion.div>}
                            {documents[id].processing && <motion.div className="mt-2 text-blue-600">Processing document...</motion.div>}
                            {documents[id].preview && (
                                <motion.div className="mt-4">
                                    <Image src={documents[id].preview} alt={`Preview of ${label}`} width={200} height={100} className="border rounded-lg" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
                <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} className={`py-2 px-8 rounded-lg font-medium ${allVerified ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={!allVerified || isSubmitting} onClick={onComplete}>
                    {isSubmitting ? 'Processing...' : 'Continue'}
                </motion.button>
            </div>
        </motion.div>
    );
}