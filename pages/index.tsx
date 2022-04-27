import React, {ReactElement, useEffect, useState} from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { URLSearchParams } from 'url';
import TemperaturePreview from '../components/TemperaturePreview';
import { Temperature } from '../DTOS/Temperature';
import { getISODateStringFromDate, sortListByTimes, subtractDaysFromDate } from '../utils/DateUtils';
import { TEMPERATURE_API_URL as API_BASE_URL } from '../config';
import { Col, Row, Grid, Tag } from 'antd';
import { buildQueryParams } from '../utils/UrlUtils';
const { useBreakpoint } = Grid;

const TEMPERATURE_ENDPOINT = "/temperature";
const TEMPERATURES_ENDPOINT = "/temperatures";
const LOCATIONS_ENDPOINT = "/locations";
const NUMBER_OF_COLUMNS = 2;

const Home: NextPage = (props) => {
  const [latestTemperatureData, setLatestTemperatureData] = useState<Temperature[]>([]);
  const [fullTemperatureData, setFullTemperatureData] = useState<Map<string, Temperature[]>>(new Map<string, Temperature[]>())
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const breakpoints = useBreakpoint();


  async function fetchLocations(date: Date): Promise<string[]> {
    let locations: string[] = []
      try {
        const params = new Map<string, string>()
          .set("date", getISODateStringFromDate(date));
        const locationsResponse = await fetch(API_BASE_URL + LOCATIONS_ENDPOINT + buildQueryParams(params));
        const locationsResponseBody = await locationsResponse.json()
        // console.log("Locations response body: ", locationsResponseBody);
        locations = locations.concat(locationsResponseBody.locations);
      } catch (e) {
        console.error("No locations were found: ", e);
      }
      // console.log(locations);
      return locations;
  }


  async function fetchLatestTemperatures(date: Date, locations: string[]): Promise<void> {
    const data: Temperature[] = [...latestTemperatureData];
    for (let location of locations) {
      const params = new Map<string, string>()
        .set("location", location)
        .set("date", getISODateStringFromDate(date));
      const url = API_BASE_URL + TEMPERATURE_ENDPOINT + buildQueryParams(params);
      // console.log(url)
      const response = await fetch(url)
      // console.log("Raw response: ", response);
      const body = await response.json();
      if (!body) {
        console.log("No results returned from api")
        continue;
      }
      console.log(body)
      let existing: Temperature | undefined;
      if (existing = data.find((t: Temperature) =>  t.location == location )) {
        // console.log(existing)
        existing.value = body.value;
        existing.time = body.time;
      } else {
        data.push({
          location: location,
          value: body.value,
          time: new Date(body.time)
        });
      }
    }
    setLatestTemperatureData(data);
  }


  async function fetchFullTemperatures(startDate: Date, endDate: Date, locations: string[]): Promise<void> {
    const startDateString = getISODateStringFromDate(startDate);
    const endDateString = getISODateStringFromDate(endDate);
    const locationMap = new Map<string, Temperature[]>();
    for (let location of locations) {
      const params = new Map<string, string>()
        .set("location", location)
        .set("startDate", startDateString)
        .set("endDate", endDateString)
      const url = API_BASE_URL + TEMPERATURES_ENDPOINT + buildQueryParams(params);
      const response = await fetch(url);
      const body = await response.json();
      // console.log("fetchFullTemperatures response body: ", body);
      if (!body) {
        console.log("No results returned from api")
        continue;
      }
      const sortedTemperaturesByDate: Temperature[] = body.sort(sortListByTimes())
      // console.log("Sorted data: ", sortedTemperaturesByDate);
      locationMap.set(location, body)
    }
    setFullTemperatureData(locationMap);
  }


  useEffect(() => {
    async function getData() {
      setDataFetched(true)
      const now = new Date();
      const locations = await fetchLocations(now);
      if (locations.length > 0) {
        await fetchLatestTemperatures(now, locations);
        await fetchFullTemperatures(subtractDaysFromDate(now, 1), now, locations)
      }
    }
    if (!dataFetched) {
      getData();
    }
  }, []);


  function mapPreviewColumns(keys: string[], data: Map<string, Temperature[]>): ReactElement {
    // console.log("keys", keys);
    // console.log("data", data)
    // console.log(`mapPreviewColumns: keys ${keys} data: ${data}`)
    let elements: ReactElement[] = [];
    for (let key of keys) {
      const temperature: Temperature[] | undefined = data.get(key)
      // console.log("temperature", temperature);
      if (temperature) {
        elements.push(
          <Col span={12} key={key}>
            <TemperaturePreview data={temperature}/>
          </Col>
        )
      }
    }
    return <>{ elements }</>
  }


  function renderTemperatureGrid(data: Map<string, Temperature[]>) {
    let elements: ReactElement[] = []
    let n = 0;
    const locations = [...data.keys()]
    while(n < locations.length) {
      elements.push(
        <Row key={n}>
          { mapPreviewColumns(locations.slice(n, n + NUMBER_OF_COLUMNS), data) }
        </Row>
      )
      n += NUMBER_OF_COLUMNS;
    }
    return <>{ elements }</>
  }


  // console.log(fullTemperatureData.size)
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        fullTemperatureData.size == 0 &&
        "No data for today yet..."
      }
      {
        fullTemperatureData.size != 0 && dataFetched &&
        renderTemperatureGrid(fullTemperatureData)
      }
      <>
       Current break point:{' '}
       {Object.entries(breakpoints)
        .filter(screen => !!screen[1])
        .map(screen => (
          <Tag color="blue" key={screen[0]}>
            {screen[0]}
          </Tag>
        ))}
    </>
    </>
  )
}

export default Home
