import React, {useEffect, useState} from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {LineChart, Line, XAxis, YAxis} from "recharts";
import { URLSearchParams } from 'url';
import TemperaturePreview from '../components/TemperaturePreview';
import { Temperature } from '../DTOS/Temperature';
import { getISODateStringFromDate, subtractDaysFromDate } from '../utils/DateUtils';
import { TEMPERATURE_API_URL } from '../config';

const TEMPERATURE_ENDPOINT = "/temperature";
const TEMPERATURES_ENDPOINT = "/temperatures";
const LOCATIONS_ENDPOINT = "/locations";

function generateDummyData() {
  return ["sun-room", "office"];
}

const Home: NextPage = (props) => {
  const [temperatureData, setTemperatureData] = useState<Temperature[]>([]);

  useEffect(() => {
    async function getData() {
      const now = new Date();
      var params = {
        location: 'office',
        date: getISODateStringFromDate(now)
      };
      console.log("Request params: ", params);
      const esc = encodeURIComponent;
      const query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
      const url = TEMPERATURE_API_URL + TEMPERATURE_ENDPOINT + "?" + query;
      // console.log(url)
      const response = await fetch(url)
      // console.log("Raw response: ", response);
      const body = await response.json();
      if (!body) {
        console.log("No results returned from api")
        return ([])
      }
      console.log(body)
      const dummyLocations: string[] = generateDummyData();
      const datum: Temperature[] = [...temperatureData];
      for (let location of dummyLocations) {
        let existing: Temperature | undefined;
        if (existing = datum.find((t: Temperature) =>  t.location == location )) {
          // console.log(existing)
          existing.value = body.value;
          existing.date = body.time;
        } else {
          datum.push({
            location: location,
            value: body.value,
            date: new Date(body.time)
          });
        }
      }
      // console.log(datum)
      setTemperatureData(datum);
    }
    getData();
    
  }, []);

  // console.log("state: ", temperatureData)

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        temperatureData.length &&
        temperatureData.map((t: Temperature) => 
          <TemperaturePreview key={t.location} latestTemperature={t}/>
        )
      }
    </>
  )
}

export default Home


// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const date = new Date();

//   var params = {
//     location: 'office',
//     date: date.getTime().toString()
//   };

//   // console.log("Request params: ", params);
//   const esc = encodeURIComponent;
//   const query = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
//   const url = API_URL + TEMPERATURE_ENDPOINT + "?" + query;
//   // console.log(url)
//   const response = await fetch(url)
//   // console.log("Raw response: ", response);
//   const body = await response.json();
//   if (!body) {
//     console.log("No results returned from api")
//     return {
//       props: {}
//     }
//   }
//   console.log(body)

//   return {
//     props: body
//   }
// }