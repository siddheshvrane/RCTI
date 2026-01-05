import { useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { MdSave, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import '../Admin.css';

const SettingsPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const updateData = {};
            if (formData.username) updateData.username = formData.username;
            if (formData.newPassword) updateData.newPassword = formData.newPassword;

            if (Object.keys(updateData).length === 0) {
                setMessage({ type: 'info', text: 'No changes to save' });
                setLoading(false);
                return;
            }

            await mockApi.updateProfile(updateData);
            setMessage({ type: 'success', text: 'Credentials updated successfully' });
            setFormData({ username: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1 className="admin-title">Admin Settings</h1>
            </div>

            <div className="admin-card" style={{ maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '20px', color: 'var(--color-primary)' }}>Update Credentials</h2>

                {message.text && (
                    <div className={`message ${message.type}`} style={{
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#ef4444' : '#16a34a'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>New Username (Optional)</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Leave blank to keep current"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Leave blank to keep current"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Confirm new password"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <MdSave /> {loading ? 'Saving...' : 'Update Credentials'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
