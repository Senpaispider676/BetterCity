export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodedAddress {
  displayName: string;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
}

const LOCATION_PERMISSION_KEY = 'bettercity_location_permission_checked';
const LAST_KNOWN_LOCATION_KEY = 'bettercity_last_known_coords';

export class MapService {
  // Default coordinates: Connaught Place, New Delhi
  static DEFAULT_COORDINATES: Coordinates = {
    lat: 28.6139,
    lng: 77.2090,
  };

  // Check if location permission was previously requested
  static hasPromptedLocation(): boolean {
    return localStorage.getItem(LOCATION_PERMISSION_KEY) !== null;
  }

  static markPromptedLocation(granted: boolean): void {
    localStorage.setItem(LOCATION_PERMISSION_KEY, granted ? 'granted' : 'denied');
  }

  // Get current device coordinates
  static getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.markPromptedLocation(false);
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.markPromptedLocation(true);
          const coords: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          localStorage.setItem(LAST_KNOWN_LOCATION_KEY, JSON.stringify(coords));
          resolve(coords);
        },
        (error) => {
          this.markPromptedLocation(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  // Reverse geocode latitude & longitude to readable address
  static async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en,hi',
          },
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          // Format compact readable address
          const addr = data.address || {};
          const parts = [
            addr.amenity || addr.building || addr.road || addr.pedestrian,
            addr.suburb || addr.neighbourhood || addr.residential || addr.sector,
            addr.city || addr.town || addr.village || addr.county || 'Delhi',
            addr.postcode,
          ].filter(Boolean);

          return parts.length > 0 ? parts.join(', ') : data.display_name.split(',').slice(0, 4).join(',');
        }
      }
    } catch (e) {
      console.warn('Reverse geocoding network lookup failed, using fallback:', e);
    }

    // Fallback format
    return `Location at ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  }

  // Search places / addresses
  static async searchAddress(query: string): Promise<Array<{ label: string; lat: number; lng: number }>> {
    if (!query || query.trim().length < 2) return [];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          signal: controller.signal,
          headers: {
            'Accept-Language': 'en,hi',
          },
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.map((item: any) => ({
          label: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        }));
      }
    } catch (e) {
      console.warn('Address search lookup failed:', e);
    }

    return [];
  }
}
