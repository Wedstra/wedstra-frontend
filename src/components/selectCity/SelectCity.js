import React, { useState } from 'react';

const StateCityDropdown = () => {
  // Data for states and cities
  const statesCitiesData = {
    Maharashtra: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kalyan-Dombivali', 'Vasai-Virar', 'Solapur', 'Mira-Bhayandar', 'Bhiwandi',
      'Amravati', 'Nanded-Waghala', 'Sangli', 'Malegaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Ichalkaranji', 'Parbhani',
      'Panvel', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Nandurbar', 'Satara', 'Wardha', 'Udgir', 'Aurangabad', 'Amalner',
      'Akot', 'Pandharpur', 'Shrirampur', 'Parli', 'Washim', 'Ambejogai', 'Manmad', 'Ratnagiri', 'Uran Islampur', 'Pusad',
      'Sangamner', 'Shirpur-Warwade', 'Malkapur', 'Wani', 'Lonavla', 'Talegaon Dabhade', 'Anjangaon', 'Umred', 'Palghar',
      'Shegaon', 'Ozar', 'Phaltan', 'Yevla', 'Shahade', 'Vita', 'Umarkhed', 'Warora', 'Pachora', 'Tumsar', 'Manjlegaon',
      'Sillod', 'Arvi', 'Nandura', 'Vaijapur', 'Wadgaon Road', 'Sailu', 'Murtijapur', 'Tasgaon', 'Mehkar', 'Yawal', 'Pulgaon',
      'Nilanga', 'Wai', 'Umarga', 'Paithan', 'Rahuri', 'Nawapur', 'Tuljapur', 'Morshi', 'Purna', 'Satana', 'Pathri', 'Sinnar',
      'Uchgaon', 'Uran', 'Pen', 'Karjat', 'Manwath', 'Partur', 'Sangole', 'Mangrulpir', 'Risod', 'Shirur', 'Savner', 'Sasvad',
      'Pandharkaoda', 'Talode', 'Shrigonda', 'Shirdi', 'Raver',
    ],
    Goa: ['Marmagao', 'Panaji', 'Margao', 'Mapusa'],
  };

  // State to hold selected state and city
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Handle state change
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity(''); // Reset city selection on state change
  };

  // Handle city change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div>
      <h1>Select State and City</h1>
      
      {/* State Dropdown */}
      <label htmlFor="state">Select State:</label>
      <select id="state" onChange={handleStateChange} value={selectedState}>
        <option value="">--Select State--</option>
        {Object.keys(statesCitiesData).map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      {selectedState && (
        <div>
          <label htmlFor="city">Select City:</label>
          <select id="city" onChange={handleCityChange} value={selectedCity}>
            <option value="">--Select City--</option>
            {statesCitiesData[selectedState].map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display Selected State and City */}
      <div>
        <h2>Selected State: {selectedState}</h2>
        <h2>Selected City: {selectedCity}</h2>
      </div>
    </div>
  );
};

export default StateCityDropdown;
