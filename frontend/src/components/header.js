import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  InputBase,
  Button,
  IconButton,
  AvatarGroup,
  Avatar,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: '1px solid',
  borderColor: theme.palette.divider,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    minWidth: '300px',
  },
}));

const Header = () => {
  return (
    <AppBar 
      position="static" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ height: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
                         
          </Typography>
          <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
                         
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AvatarGroup max={2} sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              <Avatar alt="User 1" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop" />
              <Avatar alt="User 2" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" />
            </AvatarGroup>
            <IconButton size="small" color="primary">
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ mr: 2 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            New Task
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;