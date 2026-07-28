import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GeocodeInput, GeocodeResult, GeocodingProvider } from "./geocoding-provider.interface";

type NominatimItem = {
  lat?: string;
  lon?: string;
  display_name?: string;
};

@Injectable()
export class NominatimGeocodingProvider implements GeocodingProvider {
  constructor(private readonly config: ConfigService) {}

  async geocode(input: GeocodeInput): Promise<GeocodeResult | undefined> {
    const baseUrl = this.config.get<string>("NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org/search");
    const url = new URL(baseUrl);
    url.searchParams.set("q", [input.address, input.district, input.city].filter(Boolean).join(", "));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    const response = await fetch(url, {
      headers: {
        "user-agent": `RentCity/1.0 (${this.required("NOMINATIM_CONTACT_EMAIL")})`
      }
    });
    const payload = (await response.json().catch(() => [])) as NominatimItem[];
    const item = payload[0];
    const lat = item?.lat ? Number(item.lat) : undefined;
    const lng = item?.lon ? Number(item.lon) : undefined;

    if (!response.ok) {
      throw new Error(`Nominatim geocoding failed: ${response.statusText}`);
    }

    if (lat === undefined || lng === undefined || Number.isNaN(lat) || Number.isNaN(lng)) {
      return undefined;
    }

    return {
      provider: "nominatim",
      lat,
      lng,
      formattedAddress: item.display_name
    };
  }

  private required(key: string): string {
    const value = this.config.get<string>(key);
    if (!value) throw new Error(`${key} is required when MAP_PROVIDER=nominatim.`);

    return value;
  }
}
