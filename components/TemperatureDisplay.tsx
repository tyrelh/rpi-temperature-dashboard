import { Col, Row } from "antd";
import { Temperature } from "../DTOS/Temperature";
import { getISODateStringFromDate, getTimeStringFromDate, sortListByTimes, subtractDaysFromDate, subtractMinutesFromDate } from "../utils/DateUtils";
import { formatLocationName } from "../utils/TextUtils";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { buildQueryParams } from "../utils/UrlUtils";
import { TEMPERATURES_ENDPOINT, TEMPERATURE_API_URL as API_BASE_URL } from '../config';
import Loading from "./Loading";

const MIN_TEMP = 13;
const MAX_TEMP = 30;

export interface Props {
  location: string;
}

export default function TemperatureDisplay(props: Props) {
  const [temperatureData, setTemperatureData] = useState<Temperature[]>([]);
  const [minTemperature, setMinTemperature] = useState<number>(0.0);
  const [maxTemperature, setMaxTemperature] = useState<number>(0.0);
  const [latestValueIntegerPortion, setLatestValueIntegerPortion] = useState<string>("");
  const [latestValueDecimalPortion, setLatestValueDecimalPortion] = useState<string>("");


  useEffect(() => {
    async function fetchTemperatureData(): Promise<void> {
      const now = new Date();
      await fetchFullTemperatures(subtractDaysFromDate(now, 2), now, props.location)
    };
    fetchTemperatureData();
  }, []);


  useEffect(() => {
    async function parseTemperatureData(): Promise<void> {
      if (temperatureData.length > 0) {
        let newMin = 999.9;
        let newMax = -999.9;
        for (let temperature of temperatureData) {
          if (temperature.value < newMin) {
            newMin = temperature.value;
          } else if (temperature.value > newMax) {
            newMax = temperature.value;
          }
        }
        setMinTemperature(newMin);
        setMaxTemperature(newMax);
        const temperaturesInAscendingOrderByDate = temperatureData.sort(sortListByTimes(true))
        const latest = temperaturesInAscendingOrderByDate[temperaturesInAscendingOrderByDate.length - 1]
        setLatestValueIntegerPortion(latest.value.toFixed(1).toString().split(".")[0]);
        setLatestValueDecimalPortion(latest.value.toFixed(1).toString().split(".")[1]);
      }
    }
    parseTemperatureData();
  }, [temperatureData]);


  async function fetchFullTemperatures(startDate: Date, endDate: Date, location: string): Promise<void> {
    const startDateString = getISODateStringFromDate(startDate);
    const endDateString = getISODateStringFromDate(endDate);
    const params = new Map<string, string>()
      .set("location", location)
      .set("startDate", startDateString)
      .set("endDate", endDateString)
    const url = API_BASE_URL + TEMPERATURES_ENDPOINT + buildQueryParams(params);
    const response = await fetch(url);
    const body = await response.json();
    if (!body) {
      console.log("No results returned from api")
    }
    setTemperatureData(body);
  }


  if (temperatureData.length == 0) {
    return <Loading/>
  }


  return(
    <>
      <Row>
        <h2 className="temperatureLocation highlightGradient">
          {props.location ? formatLocationName(props.location) : "-"}
        </h2>
      </Row>
      <Row className="temperaturePreviewContainer">
        <Col xl={5} lg={6} md={8} sm={7} xs={7}>
          <p className="temperaturePreviewValue">
            {latestValueIntegerPortion}<span className="temperatureUnit">.{latestValueDecimalPortion}°</span>
          </p>
          <p className="temperaturePreviewDate">
            {getTimeStringFromDate(new Date(temperatureData[temperatureData.length - 1].time))}
          </p>
        </Col>
        <Col xl={18} lg={17} md={16} sm={17} xs={17}>
          {
            minTemperature && maxTemperature &&
            <p className="temperatureMinMax">
              {`${minTemperature}° - ${maxTemperature}°`}
            </p>
          }
          <ResponsiveContainer width="100%" height={129}>
            <AreaChart data={temperatureData}>
              <defs>
                <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2fe1b9" stopOpacity={0.25}/>
                  <stop offset="90%" stopColor="#2fe1b9" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <Area
                dataKey="value"
                stroke="#2fe1b9"
                strokeWidth="2"
                fill="url(#fillColor)"
                animationDuration={2000} />
              <XAxis
                tick={{ fill: "#7e8289" }}
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tickFormatter={(time) => getTimeStringFromDate(new Date(time))} />
                
              <YAxis
                tick={{ fill: "#7e8289" }}
                type="number"
                domain={[MIN_TEMP, MAX_TEMP]}
                axisLine={false}
                tickLine={false}
                tickCount={7}
                tickFormatter={(number) => `${number.toFixed(0)}°`} />
              {/* <Tooltip/> */}
              {/* <CartesianGrid opacity={0.1} vertical={false}/> */}
            </AreaChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </>
  )
}