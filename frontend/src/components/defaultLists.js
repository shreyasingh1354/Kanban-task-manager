// frontend/src/constants/defaultLists.js

export const DEFAULT_LISTS = [
    {
      id: 'to-do',
      title: 'To Do',
      description: 'Tasks that need to be completed',
      systemType: 'to-do'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      description: 'Tasks currently being worked on',
      systemType: 'in-progress'
    },
    {
      id: 'done',
      title: 'Done',
      description: 'Completed tasks',
      systemType: 'done'
    }
  ];
  
  export const getDefaultListByType = (lists, type) => {
    if (!lists || lists.length === 0) return null;
    
    // Find list by system type if available
    const listByType = lists.find(list => list.systemType === type);
    if (listByType) return listByType;
    
    // Fallback to finding by title if system type is not available
    const listByTitle = lists.find(list => 
      list.title.toLowerCase() === type.replace('-', ' '));
    if (listByTitle) return listByTitle;
    
    // Last resort, return first list
    return lists[0];
  };
  
  export const getToDoList = (lists) => {
    return getDefaultListByType(lists, 'to-do');
  };