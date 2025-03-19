"use client";

import React, { useState, useEffect } from 'react';
import DocumentUpload from '../DocumentUpload';

export default function DocumentsUploadCard({ onComplete }) {
    const [documentsUploaded, setDocumentsUploaded] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [isModalClosing, setIsModalClosing] = useState(false);

    const handleDocumentsUpload = () => {
        setShowDocumentUpload(true);
    };

    const closeDocumentUpload = () => {
        setIsModalClosing(true);
        setTimeout(() => {
            setShowDocumentUpload(false);
            setIsModalClosing(false);
        }, 300);
    };

    const handleDocumentUploadComplete = () => {
        setDocumentsUploaded(true);
        closeDocumentUpload();
        onComplete && onComplete();
    };

    useEffect(() => {
        if (showDocumentUpload) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [showDocumentUpload]);

    return (

        <DocumentUpload
            onComplete={handleDocumentUploadComplete}
            onClose={closeDocumentUpload}
        />
    );
}