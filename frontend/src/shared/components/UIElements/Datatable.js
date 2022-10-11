import React from "react";

//import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';


const paginacionOpciones = {
    rowsPerPAgeText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsText: 'Todos'
}

const Table = props => {

    const table = <DataTable 
                    columns={props.columnas} 
                    title="Notas por evaluación" 
                    pagination 
                    paginationComponentOptions={paginacionOpciones}
                    data={props.data}
                />

    return <div className={`table ${props.className}`} style={props.style}>
            {table}
        </div>;
    //return <div className={`table ${props.className}`} style={props.style}></div>;
};

export default Table;