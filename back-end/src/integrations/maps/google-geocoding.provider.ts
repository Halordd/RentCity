import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GeocodeInput, GeocodeResult, GeocodingProvider } from "./geocoding-provider.interface";

type GoogleGeocodeResponse = {
  status?: string;
  error_message?: string;
  results?: Array<{
    formatted_address?: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
  }>;
};

@Injectable()
export class GoogleGeocodingProvider implements GeocodingProvider {
  constructor(private readonly config: ConfigService) {}

  async geocode(input: GeocodeInput): Promise<GeocodeResult | undefined> {
    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    url.searchParams.set("address", [input.address, input.district, input.city].filter(Boolean).join(", "));
    url.searchParams.set("key", this.required("GOOGLE_MAPS_API_KEY"));
    const response = await fetch(url);
    const payload = (await response.json().catch(() => ({}))) as GoogleGeocodeResponse;
    const result = payload.results?.[0];
    const lat = result?.geometry?.location?.lat;
    const lng = result?.geometry?.location?.lng;

    if (!response.ok || payload.status !== "OK" || lat === undefined || lng === undefined) {
      throw new Error(`Google geocoding failed: ${payload.error_message ?? payload.status ?? response.statusText}`);
    }

    return {
      provider: "google",
      lat,
      lng,
      formattedAddress: result.formatted_address
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when MAP_PROVIDER=google.`);

    return value;
  }
}
