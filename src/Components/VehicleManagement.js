import React, { useState, useEffect } from 'react';
import '../Style/VehicleManagement.css'; // Import the CSS file

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    model: '',
    battery: 100,
    distanceTravelled: 0,
    lastChargeTime: '',
    status: 'Idle',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing vehicles from server
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5000/vehicles');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        setError('Error fetching vehicles: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const addVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          battery: Number(formData.battery),
          distanceTravelled: Number(formData.distanceTravelled),
        }),
      });
      if (!response.ok) throw new Error('Failed to add vehicle');
      const newVehicle = await response.json();
      setVehicles([...vehicles, newVehicle]);
      resetForm();
      setSuccessMessage('Vehicle added successfully!');
    } catch (error) {
      setError('Error adding vehicle: ' + error.message);
    }
  };

  const updateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/vehicles/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          battery: Number(formData.battery),
          distanceTravelled: Number(formData.distanceTravelled),
        }),
      });
      if (!response.ok) throw new Error('Failed to update vehicle');
      const updatedVehicle = await response.json();
      setVehicles(vehicles.map(vehicle => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle)));
      resetForm();
      setSuccessMessage('Vehicle updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setError('Error updating vehicle: ' + error.message);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/vehicles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vehicle');
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      setSuccessMessage('Vehicle deleted successfully!');
    } catch (error) {
      setError('Error deleting vehicle: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      model: '',
      battery: 100,
      distanceTravelled: 0,
      lastChargeTime: '',
      status: 'Idle',
    });
    setIsEditing(false);
  };

  const handleEdit = (vehicle) => {
    setFormData(vehicle);
    setIsEditing(true);
  };

  return (
    <div className="vehicle-management">
      <h1>Vehicle Management</h1>
      <br/>
      {loading && <p>Loading vehicles...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      
      <form onSubmit={isEditing ? updateVehicle : addVehicle}>
       <div style={{display:"flex",width:"80%",flexWrap:"wrap"}}> 
       <label htmlFor="vehicle-id">ID:</label>
        <input
          type="number"
          id="vehicle-id"
          name="id"
          placeholder="Vehicle ID"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          required
          disabled={isEditing}
          tabIndex={1}
        />
        
        <label htmlFor="vehicle-model">Model:</label>
        <input
          type="text"
          id="vehicle-model"
          name="model"
          placeholder="Vehicle Model"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          required
          tabIndex={2}
        />
        
        <label htmlFor="vehicle-battery">Battery Level:</label>
        <input
          type="number"
          id="vehicle-battery"
          name="battery"
          placeholder="Battery (%)"
          value={formData.battery}
          onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
          min="0"
          max="100"
          required
          tabIndex={3}
        />
        
        <label htmlFor="vehicle-distance">Distance:</label>
        <input
          type="number"
          id="vehicle-distance"
          name="distanceTravelled"
          placeholder="Distance Travelled (km)"
          value={formData.distanceTravelled}
          onChange={(e) => setFormData({ ...formData, distanceTravelled: e.target.value })}
          min="0"
          required
          tabIndex={4}
        />
        
        <label htmlFor="vehicle-last-charge">Date:</label>
        <input
          type="datetime-local"
          id="vehicle-last-charge"
          name="lastChargeTime"
          value={formData.lastChargeTime}
          onChange={(e) => setFormData({ ...formData, lastChargeTime: e.target.value })}
          required
          tabIndex={5}
        />
        
        <label htmlFor="vehicle-status">Status:</label>
        <select
          id="vehicle-status"
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          tabIndex={6}
        >
          <option value="Idle">Idle</option>
          <option value="In Transit">In Transit</option>
          <option value="Charging">Charging</option>
        </select>
       </div>
        
        <button type="submit" tabIndex={7}>
          {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Battery (%)</th>
            <th>Distance Travelled (km)</th>
            <th>Last Charge Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.battery}</td>
              <td>{vehicle.distanceTravelled}</td>
              <td>{new Date(vehicle.lastChargeTime).toLocaleString()}</td>
              <td>{vehicle.status}</td>
              <td>
                <button onClick={() => handleEdit(vehicle)}>Edit</button>
                <button onClick={() => deleteVehicle(vehicle.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleManagement;
