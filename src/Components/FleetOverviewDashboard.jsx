// src/FleetOverviewDashboard.js
import React from 'react';

const FleetOverviewDashboard = ({ vehicles }) => {
  const totalVehicles = vehicles.length;

  // Calculate the average battery percentage
  const averageBattery = totalVehicles > 0 
    ? (vehicles.reduce((acc, vehicle) => acc + vehicle.battery, 0) / totalVehicles).toFixed(2) 
    : 0;

  // Filter vehicles with battery less than 20% and count them
  const lowBatteryVehicles = vehicles.filter(vehicle => vehicle.battery < 20);
  const lowBatteryCount = lowBatteryVehicles.length;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
      <h3>Fleet Overview</h3>
      <p><strong>Total Vehicles:</strong> {totalVehicles}</p>
      <p><strong>Average Battery:</strong> {averageBattery}%</p>
      <p><strong>Vehicles with Battery Less Than 20%:</strong> {lowBatteryCount}</p>
      
      {/* Display details of low battery vehicles */}
      {lowBatteryCount > 0 && (
        <div>
          <h4 style={{ color: 'red' }}>Low Battery Vehicles:</h4>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {lowBatteryVehicles.map(vehicle => (
              <li key={vehicle.id} style={{ backgroundColor: '#ffebee', margin: '5px 0', padding: '10px', borderRadius: '5px' }}>
                {vehicle.vehicleID} (Battery: {vehicle.battery}%)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FleetOverviewDashboard;
