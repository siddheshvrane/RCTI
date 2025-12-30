import { useState } from 'react';

/**
 * Custom hook for managing dynamic field arrays (e.g., instructors, courses)
 * @param {Array} initialFields - Initial array of fields
 * @returns {Object} - { fields, addField, removeField, updateField, setFields }
 */
export const useDynamicFields = (initialFields = []) => {
    const [fields, setFields] = useState(initialFields);

    const addField = () => {
        setFields([...fields, '']);
    };

    const removeField = (index) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const updateField = (index, value) => {
        const newFields = [...fields];
        newFields[index] = value;
        setFields(newFields);
    };

    return {
        fields,
        addField,
        removeField,
        updateField,
        setFields
    };
};
