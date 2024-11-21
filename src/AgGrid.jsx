import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import { useState } from 'react';


const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      { make: "Fiat", model: "500", price: 15774, electric: false },
      { make: "Nissan", model: "Juke", price: 20675, electric: false },
      { make: "Vauxhall", model: "Corsa", price: 18460, electric: false },
      { make: "Volvo", model: "EX30", price: 33795, electric: true },
      { make: "Mercedes", model: "Maybach", price: 175720, electric: false },
      { make: "Vauxhall", model: "Astra", price: 25795, electric: false },
      { make: "Fiat", model: "Panda", price: 13724, electric: false },
      { make: "Jaguar", model: "I-PACE", price: 69425, electric: true },
    ]);
    
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
      { field: "make", filter: true, floatingFilter: true },
      { field: "model", editable: true  },
      { field: "price", editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
          values: ['Tesla', 'Ford', 'Toyota'],
      } },
      { field: "electric", editable: true }
    ]);

    return (
        // wrapping container with theme & size
        <div
         className="ag-theme-quartz" // applying the Data Grid theme
         style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
          />
        </div>
       )
   
   }

export default GridExample