import React from "react";
import DynamicForm from "./DynamicForm.jsx";
import formSchema from "./formSchema-copy.json"; // Import your schema
import AgGrid from "./AgGrid.jsx";

const App = () => {
  // for old file
  const handleFormSubmit = (formData) => {
    console.log("Form Data:", formData);
  };

  return (
    <div className="container mt-5">
      {/* <DynamicForm schema={formSchema} apiEndpoint='http://localhost:5000/api' onSubmit={handleFormSubmit} /> */}
      <AgGrid/>
    </div>
  );
};

export default App;




