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

const TaskCard = ({ open, onClose }) => {
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
        {/* Close Button */}
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
          {/* Header with Story ID */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Story ID: 86
            </Typography>
          </Box>

          {/* Task Title */}
          <Typography variant="h6" gutterBottom>
            Create UI Components for Dashboard
          </Typography>

          {/* Status and Priority */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip 
              icon={<Schedule sx={{ fontSize: 18 }} />}
              label="In Progress"
              size="small"
              color="info"
            />
            <Chip 
              icon={<Flag sx={{ fontSize: 18 }} />}
              label="High Priority"
              size="small"
              color="error"
            />
          </Stack>

          {/* Workflow and Type */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment fontSize="small" color="action" />
              <Typography variant="body2">
                Workflow: Standard
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment fontSize="small" color="action" />
              <Typography variant="body2">
                Type: Feature
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Assignees and Due Date */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>SS</Avatar>
              <Typography variant="body2">Shreya Singh</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Due: No date
            </Typography>
          </Box>

          {/* Bottom Section with Estimates */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 'auto'
          }}>
            <Typography variant="body2" color="text.secondary">
              Estimate: Unestimated
            </Typography>
            <Chip 
              label="Team 1" 
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