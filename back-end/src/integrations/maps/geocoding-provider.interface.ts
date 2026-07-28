export type GeocodeInput = {
  address: string;
  district?: string;
  city?: string;
};

export type GeocodeResult = {
  provider: string;
  lat: number;
  lng: number;
  formattedAddress?: string;
};

export interface GeocodingProvider {
  geocode(input: GeocodeInput): Promise<GeocodeResult | undefined>;
}

export const GEOCODING_PROVIDER = Symbol("GEOCODING_PROVIDER");
