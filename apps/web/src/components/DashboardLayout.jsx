
import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import StickyHeader from './StickyHeader.jsx';
import Footer from './Footer.jsx';

const DashboardLayout = ({ children, onCartOpen }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Fixed Left Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Scrollable Right Content Area */}
      <div id="main-content"
  className="flex-1 flex flex-col h-[100dvh] overflow-y-auto md:ml-[280px] relative scroll-smooth">
        <StickyHeader 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onCartOpen={onCartOpen}
        />
        
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
