import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  AvatarGroup,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as CustomizeIcon,
  ChatBubbleOutline as CommentIcon,
  MoreVert as MoreIcon,
  DateRange as DateIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const Ticket = ({ ticket, onClick }) => {
  // Ensure ticket has necessary properties with defaults
  const safeTicket = {
    type: 'Task',
    priority: 'Medium',
    title: '',
    description: '',
    assignees: [],
    subtasks: 0,
    comments: 0,
    ...ticket  // This will overwrite defaults with actual values if they exist
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#FFE2E5';
      case 'medium':
        return '#FFF8E7';
      case 'low':
        return '#E7F7E7';
      default:
        return '#F4F2FF';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#CD2B31';
      case 'medium':
        return '#D9A200';
      case 'low':
        return '#28A745';
      default:
        return '#6E62E5';
    }
  };

  const getTypeColor = (type) => {
    return {
      background: '#F4F2FF',
      color: '#6E62E5'
    };
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer'
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: '16px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={safeTicket.type}
              size="small"
              sx={{
                height: 24,
                bgcolor: getTypeColor(safeTicket.type).background,
                color: getTypeColor(safeTicket.type).color,
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
            <Chip
              label={safeTicket.priority}
              size="small"
              sx={{
                height: 24,
                bgcolor: getPriorityColor(safeTicket.priority),
                color: getPriorityTextColor(safeTicket.priority),
                '& .MuiChip-label': {
                  px: 1,
                }
              }}
            />
          </Box>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: '1rem',
            fontWeight: 500,
            color: '#333',
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
          }}
        >
          {safeTicket.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: '0.875rem',
            color: '#666',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {safeTicket.description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <AvatarGroup
            max={3}
            sx={{
              '& .MuiAvatar-root': {
                width: 28,
                height: 28,
                fontSize: '0.75rem',
                border: '2px solid #fff',
              },
            }}
          >
            {safeTicket.assignees.map((assignee, idx) => (
              <Tooltip key={idx} title={assignee}>
                <Avatar 
                  sx={{ 
                    bgcolor: ['#E8EAF6', '#C8E6C9', '#FFE0B2'][idx % 3],
                  }}
                >
                  {assignee.charAt(0)}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LinkIcon sx={{ fontSize: 20, color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                {safeTicket.subtasks}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 20, color: '#666' }} />
              <Typography variant="body2" color="text.secondary">
                {safeTicket.comments}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Ticket;