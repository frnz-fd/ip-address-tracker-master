import { useState,useEffect } from 'react';
import Map from './assets/components/Map';
import './App.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [locationData, setLocationData] = useState(null);
  const defaultIpAddress = '192.212.174.101';
  useEffect(() => {
    handleSearchDefault();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const apiKey = 'at_a9wnHDkg7Rupm2iiGtzl22fAHT1Th';

      // If the search input is a valid IP address, use it directly.
      // If it's a valid domain, fetch the domain information.
      // Otherwise, display an error.
      let userIpAddress;
      if (isValidIpAddress(searchInput)) {
        userIpAddress = searchInput;
      } else if (isValidDomain(searchInput)) {
        const domainInfo = await fetchIpByDomain(searchInput);
        if (domainInfo) {
          userIpAddress = domainInfo.ip;
          setLocationData(domainInfo);
        } else {
          // Display an error message or handle the error appropriately.
          console.error('Failed to fetch domain information.');
          return;
        }
      } else {
        // Display an error message or handle the error appropriately.
        console.error('Invalid input. Please enter a valid IP address or domain.');
        return;
      }

      const apiUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${userIpAddress}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        // Handle non-OK response (e.g., 422 Unprocessable Entity)
        console.error('Error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();
      console.log('API Response:', data);

      setLocationData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isValidIpAddress = (input) => {
    // Check if the input is a valid IP address
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(input);
  };

  const isValidDomain = (input) => {
    // Check if the input is a valid domain
    const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.?)+[a-zA-Z]{2,63}$/;
    return domainRegex.test(input);
  };

  const fetchIpByDomain = async (domain) => {
    try {
      // Replace 'YOUR_API_KEY' with your actual API key
      const apiKey = 'at_a9wnHDkg7Rupm2iiGtzl22fAHT1Th';

      // Fetch information about the domain from the IPify API
      const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&domain=${domain}`);

      if (!response.ok) {
        console.error('Error fetching domain information:', response.status, response.statusText);
        return null;
      }

      // Parse the JSON data from the response
      const data = await response.json();

      // Return the domain information
      return data;
    } catch (error) {
      console.error('Error fetching domain information:', error);
      return null;
    }
  };
   
  const handleSearchDefault = async () => {
    try {
      const apiKey = 'at_a9wnHDkg7Rupm2iiGtzl22fAHT1Th';
      const apiUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${defaultIpAddress}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
      }

      const data = await response.json();
      setLocationData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <header className='background-top w-full h-[30%] m-auto relative'>
        <h1 className='text-center text-white text-2xl p-6'>IP Address Tracker</h1>

        <form onSubmit={handleSearch} className=' mx-auto mt-2 h-14 max-w-[505px] max-ssm:w-12/12 max-ssm:px-2 max-ssm:ml-2 px-2 '>
          <input className='cursor-pointer ml-2 max-vsm:ml-0 h-full w-[430px] max-ssm:w-[84%] rounded-s-xl outline-none px-4 max-ssm:text-sm'
            type="text"
            id="ipInput"
            name="ipInput"
            placeholder='Search for any IP address or domain'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}>
          </input>
          <button type="submit" className='cursor-pointer hover:bg-gray-700 bg-black text-white h-full w-[50px] font-black text-md rounded-e-xl'> &gt; </button>
        </form>


        <section className='z-50 absolute rounded-xl flex justify-between max-md:block bg-white w-[85%] min-h-[200px] top-[200px] left-24 max-xmd:left-16 max-md:left-14 max-sm:left-10 max-ssm:left-8 p-8 items-center'>
          <div className='h-fit p-2 max-md:w-2/3 max-ssm:w-[187px] max-ssm:p-1  max-md:mx-auto'>
            <h2 className='px-4 text-gray-400 text-sm font-bold max-md:text-center max-ssm:ml-1 max-ssm:w-full'>IP ADDRESS
              <p className=' text-lg font-black text-black '>{locationData?.ip || '192.212.174.101'}<span>&nbsp;</span></p></h2>

          </div>
          <div className='h-fit p-2 max-md:w-2/3 max-md:mx-auto'>
            <h2 className='px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center'>LOCATION
              <p className=' text-lg font-black text-black'> {locationData ? `${locationData.location.city},${locationData.location.region}, ${locationData.location.country}` : 'South San Gabriel,California, US'}</p></h2>
          </div>

          <div className='h-fit p-2 max-md:w-2/3 max-md:mx-auto'>
            <h2 className='px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center'>TIMEZONE
              <p className=' text-lg font-black text-black'>{locationData?.location.timezone || '-08:00'}</p></h2>

          </div>

          <div className='h-fit p-2 max-md:w-2/3 max-md:mx-auto'>
            <h2 className='px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center'>ISP
              <p className=' text-lg font-black text-black'>{locationData?.isp || 'Southern California Edison'}</p></h2>

          </div>
        </section>
      </header >
      <main className='bg-green-200 w-full h-[70%] z-10 '>
        {locationData && (
          <Map
            locationData={locationData}
          />
        )}
      </main>
    </>
  )
}

export default App;
// hook react & yup 