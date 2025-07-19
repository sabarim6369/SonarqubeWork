import React from 'react'

export default function ResetPassword() {
    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px', position: "absolute" }} >
            <form>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            outline: 'none',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Confirm new password"
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '16px',
                            outline: 'none',
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                    Submit
                </button>
            </form>
        </div >
    )
}
