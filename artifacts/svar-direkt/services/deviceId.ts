import AsyncStorage from "@react-native-async-storage/async-storage";

const DEVICE_ID_KEY = "@svar_direkt_device_id";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 12);
}

let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }
    const newId = generateId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    cachedDeviceId = newId;
    return newId;
  } catch {
    const fallback = generateId();
    cachedDeviceId = fallback;
    return fallback;
  }
}
