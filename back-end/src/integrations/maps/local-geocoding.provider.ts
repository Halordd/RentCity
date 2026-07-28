import { Injectable } from "@nestjs/common";
import { GeocodeInput, GeocodeResult, GeocodingProvider } from "./geocoding-provider.interface";

@Injectable()
export class LocalGeocodingProvider implements GeocodingProvider {
  async geocode(_input: GeocodeInput): Promise<GeocodeResult | undefined> {
    void _input;
    return undefined;
  }
}
