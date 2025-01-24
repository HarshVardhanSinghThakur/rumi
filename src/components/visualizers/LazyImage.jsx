import React from "react";
import { Box } from "@mui/material";

const LazyImage = ({ src, alt }) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading="lazy"
      sx={{ maxWidth: "90%", height: "auto" }}
    />
  );
};

export default LazyImage;
