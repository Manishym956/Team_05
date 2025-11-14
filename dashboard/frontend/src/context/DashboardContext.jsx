import { createContext, useContext, useReducer, useEffect } from 'react';

const DashboardContext = createContext();

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_LAYOUT':
      return { ...state, layout: action.payload };
    case 'UPDATE_LAYOUT':
      return { ...state, layout: action.payload };
    case 'TOGGLE_WIDGET':
      return {
        ...state,
        visibleWidgets: {
          ...state.visibleWidgets,
          [action.payload]: !state.visibleWidgets[action.payload],
        },
      };
    default:
      return state;
  }
};

const initialState = {
  layout: [],
  visibleWidgets: {
    trendingGames: true,
    genreChart: true,
    platformChart: true,
    ratingChart: true,
    twitchStreams: true,
  },
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState, () => {
    const saved = localStorage.getItem('dashboardState');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('dashboardState', JSON.stringify(state));
  }, [state]);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

