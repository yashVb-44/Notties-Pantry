import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import './App.css';
import HomePage from './Pages/Home/HomePage';
import ErrorPage from './Pages/ErrorPages/ErrorPage';
import LoginPage from './Pages/AuthenticationPages/LoginPage';
import CreateSubAdminPage from './Pages/AuthenticationPages/CreateSubAdminPage';
import EditSubAdminPage from './Pages/AuthenticationPages/EditSubAdminPage';
import Demo from './Components/Demo';
import axios from 'axios';
import AddShippingCharge from './Pages/InnerPages/BackEndSide/Shipping/AddShippingCharge';


function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;

}

// Create a theme with compact density
const theme = createTheme({
  components: {
    MuiDataGrid: {
      defaultProps: {
        density: 'compact',
      },
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            // padding: '4px',
          },
        },
      },
    },
  },
});


function PrivateRoute({ element }) {
  const token = localStorage.getItem('token');

  if (token) {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <ThemeProvider theme={theme}>
        <Routes>
          {/* <Route path="/*" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/*" element={<HomePage />} />

          {/* Private routes */}
          {/* <Route
            path="/*"
            element={
              <PrivateRoute
                element={<HomePage />}
              />
            }
          /> */}
          {/* <Route
            path="/addSubAdmin"
            element={
              <PrivateRoute
                element={<CreateSubAdminPage />}
              />
            }
          />
          <Route
            path="/editSubAdmin"
            element={
              <PrivateRoute
                element={<EditSubAdminPage />}
              />
            }
          /> */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
