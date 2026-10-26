import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from '@/context/AuthContext';
import ReactGA from "react-ga4";


const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const hasValidGaId = /^G-[A-Z0-9]+$/.test(gaMeasurementId || "") &&
  !gaMeasurementId.includes("REPLACE_WITH");

if (hasValidGaId) {
  ReactGA.initialize(gaMeasurementId);
} else {
  console.warn("Google Analytics is not initialized. Set VITE_GA_MEASUREMENT_ID to your new GA4 Measurement ID.");
}
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
