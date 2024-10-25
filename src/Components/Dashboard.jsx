import React, { useEffect, useState } from 'react';
import '../Style/fleet-dashboard.css';
import "../Style/Dashboard.css";

import VehicleManagement from './VehicleManagement';
import RealTimeStatus from './RealTimeStatus';
import BatteryAlerts from './BatteryAlerts';
import FleetOverviewDashboard from './FleetOverviewDashboard';
import ChargingSchedule from './ChargingSchedule';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [chargingSchedules, setChargingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles data');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError('Error fetching vehicles: ' + error.message);
      }
    };

    const fetchChargingSchedules = async () => {
      try {
        const response = await fetch('http://localhost:5000/chargingSchedule');
        if (!response.ok) throw new Error('Failed to fetch charging schedules');
        const data = await response.json();
        setChargingSchedules(data);
      } catch (error) {
        setError('Error fetching charging schedules: ' + error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchVehicles(), fetchChargingSchedules()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {loading && <p>Loading data...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            
            <VehicleManagement vehicles={vehicles} setVehicles={setVehicles} />
            <FleetOverviewDashboard vehicles={vehicles} />
            <RealTimeStatus vehicles={vehicles} />
            <BatteryAlerts vehicles={vehicles} />
            <ChargingSchedule vehicles={vehicles} chargingSchedules={chargingSchedules} setVehicles={setVehicles} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
