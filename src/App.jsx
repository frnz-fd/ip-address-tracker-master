import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Map from './assets/components/Map';
import './App.css';

function App() {
  const [locationData, setLocationData] = useState(null);
  const defaultIpAddress = '192.212.174.101';

  const schema = yup.object().shape({
    ipInput: yup
      .string()
      .trim()
      .required('IP address or domain is required')
      .test('valid-input', 'Please enter a valid IP address or domain', function (value) {
        // Check if it's a valid IP address
        if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) {
          return true;
        }
  
        // Check if it's a valid domain
        if (/^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.?)+[a-zA-Z]{2,63}$/.test(value)) {
          return true;
        }
  
        return this.createError({
          path: this.path,
          message: 'Please enter a valid IP address or domain',
        });
      }),
  });
  
  

  const { control, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ipInput: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleSearchDefault();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (data) => {
    try {
      const apiKey = 'at_a9wnHDkg7Rupm2iiGtzl22fAHT1Th';
      let userIpAddress = data.ipInput;

      if (isValidDomain(userIpAddress)) {
        const domainInfo = await fetchIpByDomain(userIpAddress);
        if (domainInfo) {
          userIpAddress = domainInfo.ip;
          setLocationData(domainInfo);
        } else {
          console.error('Failed to fetch domain information.');
          return;
        }
      }

      const apiUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&ipAddress=${userIpAddress}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
      }

      const result = await response.json();
      setLocationData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isValidDomain = (input) => /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.?)+[a-zA-Z]{2,63}$/.test(input);

  const fetchIpByDomain = async (domain) => {
    try {
      const apiKey = 'at_a9wnHDkg7Rupm2iiGtzl22fAHT1Th';
      const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=${apiKey}&domain=${domain}`);

      if (!response.ok) {
        console.error('Error fetching domain information:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
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
      <header className="background-top w-full h-[30%] m-auto relative">
        <h1 className="text-center text-white text-2xl p-6">IP Address Tracker</h1>

        <form onSubmit={handleSubmit(handleSearch)} className="mx-auto mt-2 h-14 max-w-[505px] max-ssm:w-12/12 max-ssm:px-2 max-ssm:ml-2 px-2">
          <Controller
            name="ipInput"
            control={control}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  className={`cursor-pointer ml-2 max-vsm:ml-0 h-full w-[430px] max-ssm:w-[84%] rounded-s-xl outline-none px-4 max-ssm:text-sm  ${errors.ipInput ? 'outline-red-500 outline-1 outline-offset-0' : ''
                    }`}
                  type="text"
                  id="ipInput"
                  name="ipInput"
                  placeholder="Search for any IP address or domain"
                />
              </>
            )}
          />
          <button type="submit" className="cursor-pointer hover:bg-gray-700 bg-black text-white h-full w-[50px] font-black text-md rounded-e-xl">
            {' '}
            &gt;{' '}
          </button>
          {errors.ipInput && (
            <p className="mt-2 ml-2 text-sm text-red-500">
              {errors.ipInput?.message}
            </p>
          )}
        </form>

        <section className="z-50 absolute rounded-xl flex justify-between max-md:block bg-white w-[85%] min-h-[200px] top-[200px] left-24 max-xmd:left-16 max-md:left-14 max-sm:left-10 max-ssm:left-8 p-8 items-center">
          <div className="h-fit p-2 max-md:w-2/3 max-ssm:w-[187px] max-ssm:p-1  max-md:mx-auto">
            <h2 className="px-4 text-gray-400 text-sm font-bold max-md:text-center max-ssm:ml-1 max-ssm:w-full">IP ADDRESS
              <p className=" text-lg font-black text-black ">{locationData?.ip || '192.212.174.101'}<span>&nbsp;</span></p></h2>
          </div>
          <div className="h-fit p-2 max-md:w-2/3 max-md:mx-auto">
            <h2 className="px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center">LOCATION
              <p className=" text-lg font-black text-black"> {locationData ? `${locationData.location.city},${locationData.location.region}, ${locationData.location.country}` : 'South San Gabriel,California, US'}</p></h2>
          </div>
          <div className="h-fit p-2 max-md:w-2/3 max-md:mx-auto">
            <h2 className="px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center">TIMEZONE
              <p className=" text-lg font-black text-black">{locationData?.location.timezone || '-08:00'}</p></h2>
          </div>
          <div className="h-fit p-2 max-md:w-2/3 max-md:mx-auto">
            <h2 className="px-4 text-gray-400 text-sm font-bold max-md:border-0 border-l border-l-gray-400 max-md:text-center">ISP
              <p className=" text-lg font-black text-black">{locationData?.isp || 'Southern California Edison'}</p></h2>
          </div>
        </section>
      </header>
      <main className="bg-green-200 w-full h-[70%] z-10 ">
        {locationData && <Map locationData={locationData} />}
      </main>
    </>
  );
}

export default App;
