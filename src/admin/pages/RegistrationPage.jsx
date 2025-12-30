import { useState, useEffect } from 'react';
import { MdDelete, MdSearch } from 'react-icons/md';
import '../Admin.css';

const RegistrationPage = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await fetch('/api/registrations');
            const data = await response.json();
            if (data.success) {
                setRegistrations(data.data);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this registration?')) {
            try {
                const response = await fetch(`/api/registrations/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    setRegistrations(registrations.filter(reg => reg._id !== id));
                }
            } catch (error) {
                console.error('Error deleting registration:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
    );

    if (loading) {
        return <div className="admin-loading">Loading registrations...</div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Registered Students</h2>
                <div className="admin-actions">
                    <div className="search-bar">
                        <MdSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                {registrations.length === 0 ? (
                    <div className="no-data">No registrations found.</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: '120px' }}>Date</th>
                                <th style={{ minWidth: '150px' }}>Name</th>
                                <th style={{ minWidth: '200px' }}>Contact Info</th>
                                <th style={{ minWidth: '150px' }}>Course</th>
                                <th style={{ minWidth: '200px' }}>Message</th>
                                <th style={{ minWidth: '100px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((reg) => (
                                <tr key={reg._id}>
                                    <td>{formatDate(reg.createdAt)}</td>
                                    <td>
                                        <div className="student-name">{reg.name}</div>
                                    </td>
                                    <td>
                                        <div className="contact-details">
                                            <div>{reg.email}</div>
                                            <div>{reg.phone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="course-badge">{reg.course}</span>
                                    </td>
                                    <td>
                                        <div className="message-cell" title={reg.message}>
                                            {reg.message || '-'}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(reg._id)}
                                            title="Delete Registration"
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RegistrationPage;
