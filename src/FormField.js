// src/FormField.js
import React from "react";
import { Form } from "react-bootstrap";

const FormField = ({ field, formData, formErrors, handleChange }) => {
    // Destructure the field attributes with default values for important attributes
    const {
        name,
        label = "Untitled Field", // Default label if not provided
        type = "text", // Default type as 'text' if not provided
        required = false,
        placeholder = "", // Default placeholder as an empty string
        options = [],
        min,
        max,
        step
    } = field || {}; // Optional chaining to handle undefined 'field'
    console.log("Field", field)
    const renderFieldByType = () => {
        switch (type) {
            case "select":
                return (
                    <Form.Select name={name} onChange={handleChange} required={required}>
                        <option value="">Select...</option>
                        {options?.map((option, index) => (
                            <option key={index} value={option?.value}>
                                {option?.label}
                            </option>
                        ))}
                    </Form.Select>
                );
            case "radio":
                return options?.map((option, index) => (
                    <Form.Check
                        key={index}
                        type="radio"
                        name={name}
                        value={option?.value}
                        label={option?.label}
                        onChange={handleChange}
                        required={required}
                        checked={formData[name] === option?.value}
                    />
                ));
            case "checkbox":
                return (
                    <Form.Check
                        type="checkbox"
                        name={name}
                        label={label}
                        onChange={handleChange}
                        required={required}
                        checked={formData?.[name]}
                    />
                );
            case "textarea":
                return (
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name={name}
                        placeholder={placeholder}
                        onChange={handleChange}
                        required={required}
                        value={formData?.[name] || ""}
                    />
                );
            case "range":
                return (
                    <>
                        <Form.Control
                            type="range"
                            name={field.name}
                            min={field.min || 0}
                            max={field.max || 10}
                            step={field.step || 1}
                            onChange={handleChange}
                            required={field.required}
                            value={formData[field.name] || field.min || 0} // Display value dynamically
                        />
                        <span className="slider-value">
                            {formData[field.name] || field.min || 0} {/* Display slider value */}
                        </span>
                    </>
                );

            case "file":
                return (
                    <Form.Control
                        type="file"
                        name={name}
                        onChange={handleChange}
                        required={required}
                    />
                );
            default:
                // Handle other input types (text, email, number, color, search, etc.)
                return (
                    <Form.Control
                        type={type}
                        name={name}
                        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                        onChange={handleChange}
                        required={required}
                        value={formData?.[name] || ""}
                    />
                );
        }
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label>{label || "Untitled Field"}</Form.Label>
            {renderFieldByType()}
            {formErrors?.[name] && <div className="text-danger">{formErrors?.[name]}</div>}
        </Form.Group>
    );
};

export default FormField;
