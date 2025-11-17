// Google Maps API type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  namespace places {
    class AutocompleteService {
      getPlacePredictions(
        request: AutocompletionRequest,
        callback: (
          predictions: AutocompletePrediction[] | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: HTMLElement);
      getDetails(
        request: PlaceDetailsRequest,
        callback: (
          place: PlaceResult | null,
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    interface AutocompletionRequest {
      input: string;
      location?: LatLng;
      radius?: number;
      bounds?: LatLngBounds;
      componentRestrictions?: ComponentRestrictions;
      types?: string[];
    }

    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
      };
    }

    interface PlaceDetailsRequest {
      placeId: string;
      fields: string[];
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    enum PlacesServiceStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      INVALID_REQUEST = 'INVALID_REQUEST',
    }

    interface ComponentRestrictions {
      country: string | string[];
    }
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
  }
}

export {};

