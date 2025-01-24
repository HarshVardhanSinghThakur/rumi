import React from "react";
import {   
  Table,   
  TableBody,   
  TableCell,   
  TableContainer,   
  TableHead,   
  TableRow,   
  TablePagination,   
  Paper,   
  Typography, 
} from "@mui/material";

const DataTable = ({ rows, columns }) => {   
  const [page, setPage] = React.useState(0);   
  const [rowsPerPage, setRowsPerPage] = React.useState(5);   
  const [error, setError] = React.useState(null);    

  // Validate input data   
  React.useEffect(() => {     
    if (!Array.isArray(columns) || !columns.length) {       
      setError("Invalid or missing columns data.");     
    } else if (!Array.isArray(rows)) {       
      setError("Invalid or missing rows data.");     
    } else if (       
      !rows.every((row) =>         
        columns.every((col) => row.hasOwnProperty(col.key))       
      )     
    ) {       
      setError("Row data does not match column keys.");     
    } else {       
      setError(null);     
    }   
  }, [rows, columns]);    

  const handleChangePage = (event, newPage) => setPage(newPage);   
  const handleChangeRowsPerPage = (event) =>     
    setRowsPerPage(parseInt(event.target.value, 10));    

  if (error) {     
    return (       
      <Typography color="error">
        {error}
      </Typography>     
    );   
  }    

  return (     
    <TableContainer component={Paper}>       
      <Table>         
        <TableHead>           
          <TableRow>             
            {columns.map((column, index) => (               
              <TableCell key={index}>{column.title}</TableCell>             
            ))}           
          </TableRow>         
        </TableHead>         
        <TableBody>           
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (             
              <TableRow key={index}>               
                {columns.map((column, idx) => (                 
                  <TableCell key={idx}>
                    {row[column.key] || "-"}
                  </TableCell>               
                ))}             
              </TableRow>           
            ))}         
        </TableBody>       
      </Table>       
      <TablePagination         
        rowsPerPageOptions={[5, 10, 25]}         
        component="div"         
        count={rows.length}         
        rowsPerPage={rowsPerPage}         
        page={page}         
        onPageChange={handleChangePage}         
        onRowsPerPageChange={handleChangeRowsPerPage}       
      />     
    </TableContainer>   
  ); 
};  

export default DataTable;