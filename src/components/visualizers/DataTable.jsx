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
  Button,
  Box,
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

  // Download data as CSV
  const downloadData = () => {
    const csvContent = [
      columns.map((col) => col.title).join(","), // Header row
      ...rows.map((row) =>
        columns.map((col) => `"${row[col.key] || ""}"`).join(",")
      ), // Data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h6">Data Table</Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={downloadData}
          sx={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            minWidth: "auto",
          }}
        >
          Download CSV
        </Button>
      </Box>
      <TableContainer>
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
                    <TableCell key={idx}>{row[column.key] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default DataTable;
