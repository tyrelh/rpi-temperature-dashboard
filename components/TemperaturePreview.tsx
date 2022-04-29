import { Col, Row } from "antd";
import { Temperature } from "../DTOS/Temperature";
import { getTimeStringFromDate, sortListByTimes, subtractMinutesFromDate } from "../utils/DateUtils";
import { formatLocationName } from "../utils/TextUtils";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { findMinMaxTemperatures } from "../utils/TemperatureUtils";

export interface Props {
  data: Temperature[];
  rangeMin?: number;
  rangeMax?: number;
}

export default function TemperaturePreview(props: Props) {
  const temperaturesInAscendingOrder = props.data.sort(sortListByTimes(true));
  const {min, max} = findMinMaxTemperatures(props.data)
  const latest: Temperature = temperaturesInAscendingOrder[temperaturesInAscendingOrder.length - 1];
  // console.log("latest: ", latest);
  const latestValueIntegerPortion = latest.value.toFixed(1).toString().split(".")[0];
  const latestValueDecimalPortion = latest.value.toFixed(1).toString().split(".")[1];

  if (!latest) {
    return <></>
  }

  return(
    <>
    <Row>
      <h2 className="temperatureLocation highlightGradient">
          {latest?.location ? formatLocationName(latest.location) : "-"}
        </h2>
    </Row>
    <Row className="temperaturePreviewContainer">
      <Col xl={5} lg={6} md={8} sm={10} xs={22}>
        <p className="temperaturePreviewValue">
          {latestValueIntegerPortion}<span className="temperatureUnit">.{latestValueDecimalPortion}°</span>
        </p>
        {
          min && max &&
          <p className="temperatureMinMax">
            {`${min.value}° - ${max.value}°`}
          </p>
        }
        <p className="temperaturePreviewDate">
          {getTimeStringFromDate(new Date(latest.time))}
        </p>
      </Col>
      <Col xl={18} lg={17} md={16} sm={14} xs={24}>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={temperaturesInAscendingOrder}>
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
              animationDuration={4000} />
            <XAxis
              tick={{ fill: "#7e8289" }}
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time) => getTimeStringFromDate(new Date(time))} />
              
            <YAxis
              tick={{ fill: "#7e8289" }}
              type="number"
              domain={[props?.rangeMin ? props.rangeMin : 0, props?.rangeMax ? props.rangeMax : 40]}
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