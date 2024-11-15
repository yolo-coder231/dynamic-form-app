import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios"; 
import FormField from "./FormField"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./DynamicForm.css"; // Import the CSS

const DynamicForm = ({ apiEndpoint }) => {
  const [schema, setSchema] = useState([]); 
  const [formData, setFormData] = useState({}); 
  const [formErrors, setFormErrors] = useState({});

  // Fetch MongoDB records to dynamically generate form fields
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/formFields`);
        const mongoRecords = response.data;
  
        // If mongoRecords is an array of objects, map directly over the array
        const generatedSchema = mongoRecords.map((record) => {
          return {
            name: record.name, // Use the field name from the record
            label: record.label || record.name, // Optional label fallback
            type: getInputTypeByMongoType(record.type), // Convert Mongo type to HTML input type
            required: record.required || false, // Allow customizing required field
          };
        });
  
        setSchema(generatedSchema);
      } catch (error) {
        console.error("Error fetching MongoDB records:", error);
      }
    };
  
    fetchSchema();
  }, [apiEndpoint]);
  
  // Mapping MongoDB field types to HTML input types
  const getInputTypeByMongoType = (mongoType) => {
    switch (mongoType) {
      case "string":
        return "text";
      case "number":
        return "number";
      case "boolean":
        return "checkbox";
      case "date":
        return "date";
      default:
        return "text"; // Default to text input for unhandled types
    }
  };

  // Handling form data changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handling form validation (can be extended based on requirements)
  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    schema.forEach((field) => {
      if (field.required && !formData[field.name]) {
        formIsValid = false;
        errors[field.name] = "This field is required";
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        // Send form data to API for database update
        await axios.post(`${apiEndpoint}/submitForm`, formData);
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="section-title">Dynamic Form</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          {schema.map((field, index) => (
            <Col md={6} sm={12} key={index}>
              <div className="form-section">
                <FormField
                  field={field}
                  formData={formData}
                  formErrors={formErrors}
                  handleChange={handleChange}
                />
              </div>
            </Col>
          ))}
        </Row>
        <Button className="submit-btn" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DynamicForm;
