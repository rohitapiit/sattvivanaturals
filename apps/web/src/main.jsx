import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from '@/context/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(

	<>

	
	<AuthProvider>
	<App />
	</AuthProvider>


<ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="colored"
    />

	</>
);
