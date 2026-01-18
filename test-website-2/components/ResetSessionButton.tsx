'use client'

import React from 'react'

export function ResetSessionButton() {
    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
            <button
                onClick={() => {
                    if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('frictionless_session_id')
                        window.location.reload()
                    }
                }}
                style={{
                    padding: '8px 16px',
                    background: '#3b82f6', // distinct blue for version B
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    fontWeight: 500
                }}
            >
                Reset Session (B)
            </button>
        </div>
    )
}
