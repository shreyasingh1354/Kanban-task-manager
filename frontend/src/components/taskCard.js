import React from 'react';
import {
  Modal,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import {
  Close,
  Schedule,
  Flag,
  Assignment
} from '@mui/icons-material';

const TaskCard = ({ open, onClose, task }) => {
  if (!task) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card sx={{ 
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'auto',
        m: 2
      }}>
        <IconButton 
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1
          }}
        >
          <Close />
        </IconButton>

        <CardContent sx={{ pt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Story ID: {task.id}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              icon={<Schedule sx={{ fontSize: 18 }} />}
              label={task.status}
              size="small"
              color="info"
            />
            <Chip 
              icon={<Flag sx={{ fontSize: 18 }} />}
              label={`${task.priority} Priority`}
              size="small"
              color={task.priority.toLowerCase() === 'high' ? 'error' : 
                task.priority.toLowerCase() === 'medium' ? 'warning' : 'success'}
       />
     </Stack>

     <Stack spacing={1} sx={{ mb: 2 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <Assignment fontSize="small" color="action" />
         <Typography variant="body2">
           Workflow: {task.workflow}
         </Typography>
       </Box>
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
         <Assignment fontSize="small" color="action" />
         <Typography variant="body2">
           Type: {task.taskType}
         </Typography>
       </Box>
     </Stack>

     <Divider sx={{ my: 2 }} />

     {/* Assignees Section */}
     <Box sx={{ mb: 2 }}>
       <Typography variant="subtitle2" gutterBottom>
         Assignees
       </Typography>
       <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
         {task.assignees.map((assignee, index) => (
           <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
               {assignee}
             </Avatar>
             <Typography variant="body2">{assignee}</Typography>
           </Box>
         ))}
       </Stack>
     </Box>

     {/* Date Range */}
     <Box sx={{ mb: 2 }}>
       <Typography variant="subtitle2" gutterBottom>
         Date Range
       </Typography>
       <Typography variant="body2" color="text.secondary">
         {task.dateRange}
       </Typography>
     </Box>

     {/* Statistics */}
     <Box sx={{ mb: 2 }}>
       <Typography variant="subtitle2" gutterBottom>
         Statistics
       </Typography>
       <Stack direction="row" spacing={3}>
         <Box>
           <Typography variant="body2" color="text.secondary">
             Subtasks
           </Typography>
           <Typography variant="body1">
             {task.subtasks}
           </Typography>
         </Box>
         <Box>
           <Typography variant="body2" color="text.secondary">
             Comments
           </Typography>
           <Typography variant="body1">
             {task.comments}
           </Typography>
         </Box>
       </Stack>
     </Box>

     <Divider sx={{ my: 2 }} />

     {/* Bottom Section */}
     <Box sx={{ 
       display: 'flex', 
       justifyContent: 'space-between', 
       alignItems: 'center',
       mt: 'auto'
     }}>
       <Typography variant="body2" color="text.secondary">
         Estimate: {task.estimate}
       </Typography>
       <Chip 
         label={task.team} 
         size="small" 
         variant="outlined"
       />
     </Box>
   </CardContent>
 </Card>
</Modal>
);
};

export default TaskCard;