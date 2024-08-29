// Placeholder to host a component
import React, { useState, useEffect } from "react";

const Hours = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [today, setToday] = useState('');
  const [isClient, setIsClient] = useState(false);

  const shelterHours = [
    { day: "Monday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Tuesday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Wednesday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Thursday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Friday", open: "10:00 AM", close: "4:00 PM" },
    { day: "Saturday", open: "9:00 AM", close: "8:00 PM" },
    { day: "Sunday", open: "9:00 AM", close: "8:00 PM" },
  ];

  useEffect(() => {
    setIsClient(true);
    const updateDateTime = () => {
      const now = new Date();
      setToday(now.toLocaleDateString('en-US', { weekday: 'long' }));
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const todayHours = shelterHours.find((day) => day.day === today);

  return (
    <div id="hours" style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>Today's Shelter Hours</h2>
      
      {isClient && todayHours && (
        <>
          <p style={{ fontSize: '18px', color: '#34495e' }}>
            {today}: {todayHours.open} - {todayHours.close}
          </p>
          <p style={{ fontSize: '16px', color: '#7f8c8d', marginTop: '15px' }}>
            Current Time: {currentTime}
          </p>
          <p style={{ fontSize: '16px', color: '#7f8c8d' }}>
            Today's Date: {currentDate}
          </p>
        </>
      )}
    </div>
  );
}

export default Hours;