import React, { useState, useEffect } from 'react';
import '../Style/ChargingSchedule.css';

const ChargingSchedule = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [chargingTime, setChargingTime] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null); // State for vehicle details

  // Fetch the charging schedule
  useEffect(() => {
    fetch('http://localhost:5000/chargingSchedule')
      .then(response => response.json())
      .then(data => setSchedules(data))
      .catch(error => console.error('Error fetching charging schedules:', error));
  }, []);

  // Handle vehicle selection
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
    
    // Find the selected vehicle details
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setVehicleDetails(vehicle || null); // Update vehicle details
  };

  const scheduleCharging = async (vehicleId, time) => {
    const response = await fetch('http://localhost:5000/chargingSchedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicleId, scheduledTime: time }),
    });
    const newSchedule = await response.json();
    setSchedules([...schedules, newSchedule]);
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (selectedVehicle && chargingTime) {
      scheduleCharging(selectedVehicle, chargingTime);
      setSelectedVehicle('');
      setChargingTime('');
      setVehicleDetails(null); // Reset vehicle details after scheduling
    }
  };

  return (
    <div>
      <h2>Charging Schedule</h2>
      <form onSubmit={handleSchedule}>
        <select 
          value={selectedVehicle} 
          onChange={handleVehicleChange}
        >
          <option value="">Select Vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.model}  {/* Changed from vehicle.battery to vehicle.model */}
            </option>
          ))}
        </select>
        
        <input
          type="time"
          value={chargingTime}
          onChange={(e) => setChargingTime(e.target.value)}
        />
        
        <button type="submit">Schedule Charging</button>
      </form>

      {/* Display selected vehicle details */}
      {vehicleDetails && (
        <div className="vehicle-details">
          <h3>Selected Vehicle Details:</h3>
          <p>ID: {vehicleDetails.id}</p>
          <p>Battery: {vehicleDetails.battery ? vehicleDetails.battery + '%' : 'N/A'}</p>
          <p>Distance Travelled: {vehicleDetails.distanceTravelled ? vehicleDetails.distanceTravelled + ' km' : 'N/A'}</p>
          <p>Last Charge Time: {vehicleDetails.lastChargeTime ? new Date(vehicleDetails.lastChargeTime).toLocaleString() : 'N/A'}</p>
          <p>Status: {vehicleDetails.status || 'N/A'}</p>
        </div>
      )}

      <ul>
        {schedules.map(schedule => (
          <li key={schedule.id}>
            Vehicle ID: {schedule.vehicleId} - Scheduled Time: {schedule.scheduledTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChargingSchedule;
