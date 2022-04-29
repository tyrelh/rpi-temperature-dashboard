import { Temperature } from "../DTOS/Temperature"

export function findMinMaxTemperatures(data: Temperature[]): {min: Temperature | undefined, max: Temperature | undefined} {
  let minimum: Temperature | undefined;
  let maximum: Temperature | undefined;
  for (let temperature of data) {
    if (!maximum || temperature.value > maximum.value) {
      maximum = temperature;
    }
    if (!minimum || temperature.value < minimum.value) {
      minimum = temperature;
    }
  }
  return ({
    min: minimum,
    max: maximum
  })
}