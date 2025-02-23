import React from "react";
import { Paper, Typography, Box } from "@mui/material";

const TaskCard = ({ title, label, priority }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderLeft: `5px solid ${priority === "High" ? "#ff5252" : priority === "Medium" ? "#ff9800" : "#4caf50"}` }}>
      <Typography variant="body1" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="caption" sx={{ background: "#e3f2fd", p: "2px 8px", borderRadius: "4px", display: "inline-block", mt: 1 }}>
        {label}
      </Typography>
    </Paper>
  );
};

export default TaskCard;