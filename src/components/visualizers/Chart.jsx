import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA40FF"];

const Chart = ({ type, data }) => {
  if (!data || !data.chartData) {
    return (
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">Error: Invalid chart data</Typography>
      </Paper>
    );
  }

  const { chartData, chartOptions } = data;

  
  const downloadData = () => {
    const csvRows = [
      Object.keys(chartData[0]).join(","), // Headers
      ...chartData.map((row) => Object.values(row).join(",")), // Rows
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${chartOptions?.title || "chart-data"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h3" gutterBottom>
          {chartOptions?.title || "Chart"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small" 
          sx={{
            fontSize: "0.75rem", 
            padding: "4px 8px",  
            minWidth: "auto",    
          }}
          onClick={downloadData}
        >
          Download
        </Button>
      </Box>
      <Box display="flex" justifyContent="center">
        {type === "pie" && (
          <PieChart width={500} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, value, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${(
                  (value /
                    chartData.reduce((sum, item) => sum + item.value, 0)) *
                  100
                ).toFixed(1)}%)`,
                name,
              ]}
            />
          </PieChart>
        )}
        {type === "bar" && (
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        )}
        {type === "line" && (
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        )}
      </Box>
    </Paper>
  );
};

export default Chart;
