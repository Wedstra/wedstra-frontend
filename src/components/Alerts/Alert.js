import React from 'react'

export default function Alert({ type, message, isOpen, onClose }) {
    if (!isOpen) return null;

    const alertStyles = {
        success: "alert alert-success",
        error: "alert alert-danger",
    };


    return (
        <div class={`alert-dismissible fade show ${ alertStyles[type] }`} role="alert">
            { message }
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClose} ></button>
        </div>
    )
}
