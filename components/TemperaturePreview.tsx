import { Col, Row } from "antd";
import { Temperature } from "../DTOS/Temperature";
import { getTimeStringFromDate, subtractMinutesFromDate } from "../utils/DateUtils";
import { formatLocationName } from "../utils/TextUtils";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export interface Props {
  latestTemperature: Temperature
  historicalTemperatures?: Temperature[];
}

export default function TemperaturePreview(props: Props) {

  function createDummyHistoricalData(location: string | undefined): Temperature[] {
    let data: Temperature[] = [];
    let now = new Date();
    let n = 20;
    for (;n >=0; n--) {
      data.push(
        {
          location: location,
          date: subtractMinutesFromDate(now, n),
          value: ((Math.random() * 10) + 19).toFixed(1)
        }
      )
    }
    return data
  }

  const latest = props.latestTemperature;
  console.log("latest: ", latest)
  const historical = props?.historicalTemperatures;
  const now = new Date();

  // if (!latest) {
  //   return <></>
  // }

  return(
    <Row className="temperaturePreviewContainer">
      <Col span={5}>
        <h2 className="temperaturePreviewLocation">
          {latest?.location ? formatLocationName(latest.location) : "-"}
        </h2>
        <p className="temperaturePreviewValue">
          {latest.value}°C
        </p>
        <p className="temperaturePreviewDate">
          {getTimeStringFromDate(latest.date)}
        </p>
      </Col>
      <Col span={19}>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={createDummyHistoricalData(latest.location)}>
            <defs>
              <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2fe1b9" stopOpacity={0.2}/>
                <stop offset="50%" stopColor="#2fe1b9" stopOpacity={0.02}/>
              </linearGradient>
              <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2fe1b9" stopOpacity={1}/>
                <stop offset="100%" stopColor="#2fe1b9" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#strokeColor)"
              strokeWidth="2"
              fill="url(#fillColor)"
              animationDuration={5000} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={(date) => getTimeStringFromDate(date)} />
            <YAxis
              type="number"
              domain={[0, 30]}
              axisLine={false}
              tickLine={false}
              tickCount={10}
              tickFormatter={(number) => `${number.toFixed(0)}°C`} />
            <Tooltip/>
            <CartesianGrid opacity={0.1} vertical={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  )
}