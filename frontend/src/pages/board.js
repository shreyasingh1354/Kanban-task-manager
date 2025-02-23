import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as BoardIcon,
  ViewList as ListIcon,
  MoreHoriz as MoreIcon,
  FilterList as FilterIcon,
  Settings as CustomizeIcon
} from '@mui/icons-material';

import Sidebar from '../components/sidebar';
import TaskCard from '../components/taskCard';
import Ticket from '../components/ticket';
import AddTicketModal from '../components/addticketmodal';

/* ------------------------------------
   BOARD NAVIGATION COMPONENT (UNCHANGED)
   ------------------------------------ */
const BoardNavigation = ({ view, onViewChange, onAddTicketClick }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}> </Typography>
    <Typography variant="h6" sx={{ fontWeight: 600 }}> </Typography>
    <Typography variant="h6" sx={{ fontWeight: 600 }}> </Typography>
    
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={onViewChange}
      size="small"
      sx={{ mx: 2 }}
    >
      <ToggleButton value="board" sx={{ px: 2 }}>
        <BoardIcon sx={{ mr: 1 }} fontSize="small" />
        Board
      </ToggleButton>
      <ToggleButton value="list" sx={{ px: 2 }}>
        <ListIcon sx={{ mr: 1 }} fontSize="small" />
        List
      </ToggleButton>
    </ToggleButtonGroup>

    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 280,
          borderRadius: '8px',
        }}
      >
        <SearchIcon sx={{ p: 1, color: 'text.secondary' }} />
        <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search in view..." />
      </Paper>

      <Button startIcon={<FilterIcon />} variant="outlined" sx={{ borderRadius: '8px' }}>
        Filter
      </Button>

      <Button startIcon={<CustomizeIcon />} variant="outlined" sx={{ borderRadius: '8px' }}>
        Customize
      </Button>

      {/* The "Add" button that opens the modal */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ borderRadius: '8px', ml: 'auto' }}
        onClick={onAddTicketClick}
      >
        Add
      </Button>
    </Box>
  </Box>
);

/* ------------------------------------
   COLUMN HEADER COMPONENT (UNCHANGED)
   ------------------------------------ */
const ColumnHeader = ({ title, count, onAdd }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ color: 'text.secondary', bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1 }}
      >
        {count}
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton size="small" onClick={onAdd}>
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton size="small">
        <MoreIcon fontSize="small" />
      </IconButton>
    </Box>
  </Box>
);

/* ------------------------------------
   BOARD COMPONENT
   ------------------------------------ */
const Board = () => {
  const [view, setView] = useState('board');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const location = useLocation();

  // Moved columns into a state so we can modify them
  const [columns, setColumns] = useState([
    {
      title: 'To-Do',
      count: 4,
      items: [
        {
          id: 2,
          title: 'Solar web app design for big change implementation',
          type: 'Design',
          priority: 'High',
          dateRange: 'Dec 2, 24',
          assignees: ['JD', 'AM'],
          subtasks: 15,
          comments: 7,
          status: 'To-Do',
          workflow: 'Standard',
          taskType: 'Feature',
          estimate: 'Unestimated',
          team: 'Team 2'
        },
      ],
    },
    {
      title: 'In Progress',
      count: 3,
      items: [
        {
          id: 1,
          title: 'Mobile app design implementation',
          type: 'Design',
          priority: 'High',
          dateRange: 'Apr 1, 24 - Dec 2, 24',
          assignees: ['JD', 'AM', 'SK'],
          subtasks: 9,
          comments: 3,
          status: 'In Progress',
          workflow: 'Standard',
          taskType: 'Feature',
          estimate: 'Unestimated',
          team: 'Team 1'
        },
      ],
    },
    {
      title: 'Complete',
      count: 3,
      items: [
        {
          id: 3,
          title: 'Mobile app design prototype',
          type: 'Design',
          priority: 'High',
          dateRange: 'Dec 2, 24',
          assignees: ['JD', 'SK'],
          subtasks: 2,
          comments: 2,
          status: 'Complete',
          workflow: 'Standard',
          taskType: 'Feature',
          estimate: 'Unestimated',
          team: 'Team 1'
        },
      ],
    },
  ]);

  // State for the AddTicketModal
  const [addTicketOpen, setAddTicketOpen] = useState(false);

  // Dragging info
  const [dragging, setDragging] = useState(null);

  // Toggle sidebar
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Switch between board/list view
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Open the TaskCard panel
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Close TaskCard
  const handleCloseTask = () => {
    setSelectedTask(null);
  };

  /* ------------------------------------
     DRAG & DROP
     ------------------------------------ */
  const handleDragStart = (e, ticket, sourceColIndex) => {
    setDragging({ ticket, sourceColIndex });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColIndex) => {
    e.preventDefault();
    if (!dragging) return;

    const { ticket, sourceColIndex } = dragging;
    // If same column, do nothing
    if (sourceColIndex === targetColIndex) {
      setDragging(null);
      return;
    }

    // Make a copy
    const newColumns = [...columns];

    // Remove from the source column
    newColumns[sourceColIndex].items = newColumns[sourceColIndex].items.filter(
      (it) => it.id !== ticket.id
    );

    // Add to the target column
    newColumns[targetColIndex].items = [
      ...newColumns[targetColIndex].items,
      { ...ticket, status: newColumns[targetColIndex].title },
    ];

    // Update counts
    newColumns[sourceColIndex].count = newColumns[sourceColIndex].items.length;
    newColumns[targetColIndex].count = newColumns[targetColIndex].items.length;

    setColumns(newColumns);
    setDragging(null);
  };

  /* ------------------------------------
     ADD TICKET
     ------------------------------------ */
  const handleAddTicket = (ticketData) => {
    setColumns((prevCols) => {
      // find "To-Do" column and add
      return prevCols.map((col) => {
        if (col.title === 'To-Do') {
          return {
            ...col,
            items: [...col.items, ticketData],
            count: col.count + 1,
          };
        }
        return col;
      });
    });
  };

  return (
    <Box sx={{ display: 'left', height: '100vh', bgcolor: '#f8f9fa' }}>
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: sidebarOpen ? '260px' : 0,
          width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
          transition: 'margin-left 0.3s, width 0.3s',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <BoardNavigation
          view={view}
          onViewChange={handleViewChange}
          onAddTicketClick={() => setAddTicketOpen(true)}
        />
        
        <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto' }}>
          {columns.map((column, colIndex) => (
            <Box
              key={colIndex}
              sx={{ width: 320, minWidth: 320, p: 2, borderRadius: 2 }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, colIndex)}
            >
              <ColumnHeader 
                title={column.title} 
                count={column.count} 
                onAdd={() => console.log(`Add to ${column.title}`)}
              />
              {column.items.map((item) => (
                <Box
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item, colIndex)}
                >
                  <Ticket 
                    ticket={item} 
                    onClick={() => handleTaskClick(item)}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* The TaskCard that slides out for details */}
      <TaskCard 
        open={Boolean(selectedTask)} 
        task={selectedTask} 
        onClose={handleCloseTask} 
      />

      {/* The modal we imported from its own file */}
      <AddTicketModal
        open={addTicketOpen}
        onClose={() => setAddTicketOpen(false)}
        onAddTicket={handleAddTicket}
      />
    </Box>
  );
};

export default Board;
