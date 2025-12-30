import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

/**
 * Reusable dynamic field manager component for admin forms
 * @param {string} label - Label for the field group
 * @param {Array} fields - Array of field values
 * @param {Array} options - Array of option objects { value, label }
 * @param {Function} onAdd - Handler for adding new field
 * @param {Function} onRemove - Handler for removing field (receives index)
 * @param {Function} onChange - Handler for field value change (receives index, value)
 * @param {string} placeholder - Placeholder text for select
 */
const DynamicFieldManager = ({
    label,
    fields,
    options,
    onAdd,
    onRemove,
    onChange,
    placeholder = 'Select option'
}) => {
    return (
        <div className="admin-input-group">
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-gray-700)', fontWeight: 500 }}>
                {label}
            </label>
            {fields.map((fieldValue, index) => (
                <div key={index} className="admin-dynamic-row">
                    <select
                        value={fieldValue}
                        onChange={(e) => onChange(index, e.target.value)}
                        className="admin-select"
                        style={{ flex: 1 }}
                    >
                        <option value="">{placeholder}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="btn-icon danger"
                        title={`Remove ${label}`}
                    >
                        <FaMinus />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="btn btn-outline"
                style={{ fontSize: '0.9rem', padding: '6px 12px' }}
            >
                <FaPlus style={{ marginRight: '5px' }} /> Add {label}
            </button>
        </div>
    );
};

export default DynamicFieldManager;
