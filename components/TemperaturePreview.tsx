import { Temperature } from "../DTOS/Temperature";
import { getTimeStringFromDate } from "../utils/DateUtils";
import { formatLocationName } from "../utils/TextUtils";

export interface Props {
  latestTemperature: Temperature
  historicalTemperatures?: Temperature[];
}

export default function TemperaturePreview(props: Props) {
  const latest = props.latestTemperature;
  console.log("latest: ", latest)
  const historical = props?.historicalTemperatures;
  const now = new Date();

  return(
    <div className="temperaturePreviewContainer">
      <h2 className="temperaturePreviewLocation">
        {latest?.location ? formatLocationName(latest.location) : "-"}
      </h2>
      <p className="temperaturePreviewValue">
        {latest.value}°C
      </p>
      <p className="temperaturePreviewDate">
        {getTimeStringFromDate(latest.date)}
      </p>
      {/* <LineChart height={400} width={800} data={data}>
        <Line type="monotone" dataKey="value" stroke="#778799"/>
        <XAxis dataKey="time" />
        <YAxis />
      </LineChart> */}
    </div>
  )
}