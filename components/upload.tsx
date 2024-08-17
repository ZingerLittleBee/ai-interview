import React, { useState } from 'react';

export default function UploadForm() {
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await fetch('/api/resume', {
                method: 'POST',
                body: formData,
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <button type="submit">上传 PDF</button>
        </form>
    );
}
