import React, { useEffect } from 'react';

const RealTimeStatus = ({ vehicles, setVehicles }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === "In Transit" && vehicle.battery > 0) {
            return { ...vehicle, battery: vehicle.battery - 1 };
          }
          if (vehicle.status === "Charging" && vehicle.battery < 100) {
            return { ...vehicle, battery: vehicle.battery + 10 };
          }
          return vehicle;
        })
      );
    }, 600000); // every 10 minutes for charging simulation
    return () => clearInterval(interval);
  }, [setVehicles]);

  return <div>{/* Display real-time status updates */}</div>;
};

export default RealTimeStatus;
