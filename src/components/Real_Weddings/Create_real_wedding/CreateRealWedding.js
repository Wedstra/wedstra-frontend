import React, { useState, useEffect } from 'react';
import "./createRealWedding.css";
import axiosInstance from '../../../API/axiosInstance';
import useAuthCheck from '../../../Auth/useAuthCheck';
export default function CreateRealWedding() {
    useAuthCheck();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [title, setTitle] = useState('');
    const [token, setToken] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    useEffect(() => {
        const fetchToken = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }

        fetchToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Title:", title);
        // console.log("Files:", selectedFiles);

        // Example: FormData to send to backend
        const formData = new FormData();
        formData.append("title", title);
        selectedFiles.forEach(file => formData.append("files", file));

        // Send formData using fetch/axios
        console.log("Submitting form data..." + formData.get("title"), formData.getAll("files"));
        try {
            const response = await axiosInstance.post('/api/real-weddings/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200){
                alert("Real Wedding uploaded successfully!");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
        }
        navigate("/home");
    };

    return (
        <div className="container mt-4 create-real-wedding">
            <h1 className="text-center mb-4">Create Real Wedding</h1>
            <form onSubmit={handleSubmit}>
                {/* Title Field */}
                <div className="mb-3">
                    <label htmlFor="weddingTitle" className="form-label">Wedding Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="weddingTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter wedding title"
                        required
                    />
                </div>

                {/* File Upload */}
                <div className="mb-3">
                    <label htmlFor="fileUpload" className="form-label">Select Wedding Files (Images or Videos)</label>
                    <input
                        type="file"
                        className="form-control"
                        id="fileUpload"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Image Preview */}
                {selectedFiles.length > 0 && (
                    <div className="preview mt-3">
                        <h5>Preview (Images only):</h5>
                        <div className="d-flex flex-wrap gap-3">
                            {selectedFiles.map((file, idx) =>
                                file.type.startsWith('image/') ? (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(file)}
                                        alt="Preview"
                                        style={{ width: '150px', height: '100px', objectFit: 'cover' }}
                                    />
                                ) : null
                            )}
                        </div>
                    </div>
                )}

                <button type="submit" className="btn btn-primary mt-4">Submit</button>
            </form>
        </div>
    );
}