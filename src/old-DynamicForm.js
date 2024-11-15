import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DynamicForm.css"; // Import the CSS

const DynamicForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [schema, setSchema] = useState(null); // State to store fetched schema
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch form schema from API when component mounts
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/form-schema");
        if (!response.ok) {
          throw new Error("Failed to fetch form schema");
        }
        const data = await response.json();
        setSchema(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files : value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    schema?.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (field.required && !formData?.[field.name]) {
            formIsValid = false;
            errors[field.name] = "This field is required";
          }
        });
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      // Prepare the API body content
      const apiBody = schema.reduce((acc, section) => {
        const sectionKey = section.sectionTitle || "Untitled Section";
        acc[sectionKey] = {};
        section.fields.forEach((field) => {
          acc[sectionKey][field.name] = formData?.[field.name];
        });
        return acc;
      }, {});

      console.log("API Body Content:", apiBody);

      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const label = field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1);

    switch (field.type) {
      case "select":
        return (
          <Form.Select
            name={field.name}
            onChange={handleChange}
            required={field.required}
            value={formData?.[field.name] || ""}
          >
            <option value="">Select...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      case "radio":
        return field.options?.map((option, index) => (
          <Form.Check
            key={index}
            type="radio"
            name={field.name}
            value={option.value}
            label={option.label}
            onChange={handleChange}
            required={field.required}
            checked={formData?.[field.name] === option.value}
          />
        ));
      case "checkbox":
        return (
          <Form.Check
            type="checkbox"
            name={field.name}
            label={label}
            onChange={handleChange}
            required={field.required}
            checked={formData?.[field.name] || false}
          />
        );
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            name={field.name}
            placeholder={field.placeholder || `Enter ${label}`}
            onChange={handleChange}
            required={field.required}
            value={formData?.[field.name] || ""}
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
              value={formData?.[field.name] || field.min || 0} // Display value dynamically
            />
            <span className="slider-value">
              {formData?.[field.name] || field.min || 0} {/* Display slider value */}
            </span>
          </>
        );
      case "file":
        return (
          <Form.Control
            type="file"
            name={field.name}
            onChange={handleChange}
            required={field.required}
          />
        );
      default:
        return (
          <Form.Control
            type={field.type}
            name={field.name}
            placeholder={field.placeholder || `Enter ${label.toLowerCase()}`}
            onChange={handleChange}
            required={field.required}
            value={formData?.[field.name] || ""}
          />
        );
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit}>
        {schema?.map((section, sectionIndex) => (
          <div key={sectionIndex} className="form-section">
            <h3 className="section-title">{section.sectionTitle || "Untitled Section"}</h3>
            <Row className="g-4">
              {section.fields.map((field, fieldIndex) => (
                <Col md={6} key={fieldIndex}>
                  <Form.Group className="mb-3">
                    <Form.Label>{field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Form.Label>
                    {renderField(field)}
                    {formErrors[field.name] && (
                      <div className="text-danger">
                        {formErrors[field.name]}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </div>
        ))}
        <Button variant="primary" type="submit" className="submit-btn">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DynamicForm;
