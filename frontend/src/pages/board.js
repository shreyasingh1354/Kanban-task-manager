import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  InputBase,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert
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
// import AddListModal from '../components/AddListModal';
import { getBoardLists, getListTasks, updateTask } from '../services/boardService';

/* ------------------------------------
   BOARD NAVIGATION COMPONENT
   ------------------------------------ */
const BoardNavigation = ({ view, onViewChange, onAddTicketClick, onAddListClick }) => (
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

      {/* <Button
        variant="outlined"
        startIcon={<AddIcon />}
        sx={{ borderRadius: '8px' }}
        onClick={onAddListClick}
      >
        Add List
      </Button> */}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ borderRadius: '8px', ml: 'auto' }}
        onClick={onAddTicketClick}
      >
        Add Task
      </Button>
    </Box>
  </Box>
);

/* ------------------------------------
   COLUMN HEADER COMPONENT
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
const Board = ({ boardId, teamId }) => {
  const [view, setView] = useState('board');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [addTicketOpen, setAddTicketOpen] = useState(false);
  const [addListOpen, setAddListOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);
  const location = useLocation();
  
  // Dragging state
  const [dragging, setDragging] = useState(null);

  // Fetch board data
  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) return;
      
      setLoading(true);
      try {
        // Get lists for this board
        const listsData = await getBoardLists(boardId);
        setLists(listsData);
        
        // Fetch tasks for each list
        const tasksObj = {};
        for (const list of listsData) {
          const listTasks = await getListTasks(list.id);
          tasksObj[list.id] = listTasks;
        }
        setTasks(tasksObj);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching board data:", err);
        setError(err.response?.data?.message || "Failed to load board data");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

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
  const handleCloseTask = async (updatedTask) => {
    if (updatedTask) {
      // Update tasks state with the updated task
      setTasks(prevTasks => {
        const listId = updatedTask.list_id;
        return {
          ...prevTasks,
          [listId]: prevTasks[listId].map(task => 
            task.id === updatedTask.id ? updatedTask : task
          )
        };
      });
    }
    setSelectedTask(null);
  };

  /* ------------------------------------
     DRAG & DROP
     ------------------------------------ */
  const handleDragStart = (e, task, sourceListId) => {
    setDragging({ task, sourceListId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetListId) => {
    e.preventDefault();
    if (!dragging) return;

    const { task, sourceListId } = dragging;
    // If same list, do nothing
    if (sourceListId === targetListId) {
      setDragging(null);
      return;
    }

    try {
      // Update the task on the backend
      const updatedTask = await updateTask(task.id, {
        ...task,
        list_id: targetListId
      });

      // Update local state
      setTasks(prevTasks => {
        return {
          ...prevTasks,
          // Remove from source list
          [sourceListId]: prevTasks[sourceListId].filter(t => t.id !== task.id),
          // Add to target list
          [targetListId]: [...prevTasks[targetListId], updatedTask]
        };
      });
    } catch (err) {
      console.error("Error moving task:", err);
      setError("Failed to move task. Please try again.");
    }

    setDragging(null);
  };

  /* ------------------------------------
     ADD TASK
     ------------------------------------ */
  const handleAddTask = (task) => {
    if (task && task.list_id) {
      // Update tasks in the specific list
      setTasks(prevTasks => ({
        ...prevTasks,
        [task.list_id]: [...(prevTasks[task.list_id] || []), task]
      }));
    }
    setAddTicketOpen(false);
  };

  /* ------------------------------------
     ADD LIST
     ------------------------------------ */
  const handleAddList = (list) => {
    // Add list to state
    setLists(prevLists => [...prevLists, list]);
    // Initialize empty tasks array for this list
    setTasks(prevTasks => ({
      ...prevTasks,
      [list.id]: []
    }));
    setAddListOpen(false);
  };

  /* ------------------------------------
     OPEN ADD TASK MODAL FOR SPECIFIC LIST
     ------------------------------------ */
  const handleAddTaskToList = (listId) => {
    setCurrentListId(listId);
    setAddTicketOpen(true);
  };

  /* Display loading spinner when fetching data */
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        <BoardNavigation
          view={view}
          onViewChange={handleViewChange}
          onAddTicketClick={() => {
            setCurrentListId(null);
            setAddTicketOpen(true);
          }}
          onAddListClick={() => setAddListOpen(true)}
        />
        
        <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto' }}>
          {lists.map((list) => {
            const listTasks = tasks[list.id] || [];
            return (
              <Box
                key={list.id}
                sx={{ width: 320, minWidth: 320, p: 2, borderRadius: 2 }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, list.id)}
              >
                <ColumnHeader 
                  title={list.title} 
                  count={listTasks.length} 
                  onAdd={() => handleAddTaskToList(list.id)}
                />
                {listTasks.map((task) => (
                  <Box
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, list.id)}
                    sx={{ mb: 2 }}
                  >
                    <Ticket 
                      ticket={task} 
                      onClick={() => handleTaskClick(task)}
                    />
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* The TaskCard that slides out for details */}
      <TaskCard 
        open={Boolean(selectedTask)} 
        task={selectedTask} 
        onClose={handleCloseTask} 
      />

      {/* The modal for adding a new task */}
      <AddTicketModal
        open={addTicketOpen}
        onClose={() => setAddTicketOpen(false)}
        onAddTicket={handleAddTask}
        defaultListId={currentListId}
        boardId={boardId}
        lists={lists}
      />

      {/* The modal for adding a new list */}
      {/* <AddListModal
        open={addListOpen}
        onClose={() => setAddListOpen(false)}
        onAddList={handleAddList}
        boardId={boardId}
      /> */}
    </Box>
  );
};

export default Board;