import React from 'react';
import "../Style/BatteryAlerts.css";

const BatteryAlerts = ({ vehicles }) => {
  const lowBatteryVehicles = vehicles.filter(vehicle => vehicle.battery < 15);

  return (
    <div className="battery-alerts">
      <h2>Battery Alerts</h2>
      {lowBatteryVehicles.length > 0 ? (
        lowBatteryVehicles.map(vehicle => (
          <div key={vehicle.id} className="alert">
            <span style={{ color: 'red' }}>⚠️</span> Vehicle {vehicle.id} has a low battery: {vehicle.battery}%
          </div>
        ))
      ) : (
        <div className="no-alerts">All vehicles are in good condition!</div>
      )}
    </div>
  );
};

export default BatteryAlerts;
