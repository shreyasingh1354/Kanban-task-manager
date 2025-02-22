import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  AvatarGroup,
  Avatar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const Board = () => {
  const columns = [
    {
      title: 'To-do',
      count: 3,
      items: [
        {
          title: 'Employee Details',
          type: 'Dashboard',
          priority: 'Medium',
          assignees: ['JD', 'AM'],
          comments: 12,
        },
        {
          title: 'Super Admin Role',
          type: 'Dashboard',
          priority: 'High',
          assignees: ['JD'],
          comments: 8,
        }
      ]
    },
    {
      title: 'In Progress',
      count: 2,
      items: [
        {
          title: 'Customer Role',
          type: 'Dashboard',
          priority: 'Medium',
          assignees: ['AM'],
          comments: 10,
        }
      ]
    },
    {
      title: 'In Review',
      count: 4,
      items: [
        {
          title: 'Component & Color style',
          type: 'Design',
          priority: 'Low',
          assignees: ['JD', 'AM'],
          comments: 3,
        }
      ]
    },
    {
      title: 'Completed',
      count: 6,
      items: [
        {
          title: 'Moodboarding and List style',
          type: 'Dashboard',
          priority: 'High',
          assignees: ['AM'],
          comments: 45,
        }
      ]
    }
  ];

  const getChipColor = (type) => {
    return type === 'Dashboard' ? 'secondary' : 'info';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Box sx={{ p: 3, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {columns.map((column, index) => (
          <Box key={index} sx={{ width: 320, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {column.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {column.count}
                </Typography>
              </Box>
              <IconButton size="small">
                <AddIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {column.items.map((item, itemIndex) => (
                <Paper
                  key={itemIndex}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 2 },
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={item.type}
                      size="small"
                      color={getChipColor(item.type)}
                    />
                    <Chip
                      label={item.priority}
                      size="small"
                      color={getPriorityColor(item.priority)}
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                      {item.assignees.map((assignee, assigneeIndex) => (
                        <Avatar key={assigneeIndex} sx={{ bgcolor: 'grey.300' }}>
                          {assignee}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="body2" color="text.secondary">
                      {item.comments} comments
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Board;