import React from "react";
import DataTable from "../../components/visualizers/DataTable";
import MuiChart from "../../components/visualizers/Chart";
import LazyImage from "../../components/visualizers/LazyImage";
import ImageCarousel from "../../components/visualizers/ImageCarousel";

const ChatbotRenderer = ({ response }) => {
  switch (response.type) {
    case "table":
      return (
        <DataTable 
          rows={response.data.rows} 
          columns={response.data.columns} 
        />
      );

    case "chart":
      
      return (
        <MuiChart
          type={response.chartType}
          data={response.data}
          options={response.data.chartOptions}
        />
      );

    case "image":
      
      return response.data.length > 1 ? (
        <ImageCarousel images={response.data} />
      ) : (
        <LazyImage src={response.data[0]} alt="Chatbot Media" />
      );

    default:
      
      return (
        <div style={{ textAlign: "center", padding: "1rem", color: "red" }}>
          Unsupported response type: {response.type}
        </div>
      );
  }
};

export default ChatbotRenderer;
