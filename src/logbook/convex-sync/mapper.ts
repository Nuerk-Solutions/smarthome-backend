import { createHash } from 'node:crypto';

export interface MirrorMapping {
  organizationId: string;
  drivers: Record<string, string>;
  vehicles: Record<string, string>;
}

export function mapEntry(raw: any, mapping: MirrorMapping) {
  const sourceId = String(raw._id);
  const driverId = mapping.drivers[raw.driver];
  const vehicleId = mapping.vehicles[raw.vehicle];
  if (!/^[a-f\d]{24}$/.test(sourceId) || !Object.prototype.hasOwnProperty.call(mapping.drivers, raw.driver) ||
      !Object.prototype.hasOwnProperty.call(mapping.vehicles, raw.vehicle) || !driverId || !vehicleId) {
    throw new Error(`Unknown driver, vehicle or source ID: ${sourceId}`);
  }
  const number = (value: any) => {
    if (value === null || value === undefined || value === '') throw new Error(`Missing number: ${sourceId}`);
    const result = Number(value.toString());
    if (!Number.isFinite(result)) throw new Error(`Invalid number: ${sourceId}`);
    return result;
  };
  const date = (value: any) => {
    const result = new Date(value).getTime();
    if (!Number.isFinite(result)) throw new Error(`Invalid date: ${sourceId}`);
    return result;
  };
  const text = (value: any) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing text: ${sourceId}`);
    return value.trim();
  };
  const startOdometer = number(raw.mileAge?.current);
  const endOdometer = number(raw.mileAge?.new);
  if (!Number.isSafeInteger(startOdometer) || !Number.isSafeInteger(endOdometer) || startOdometer < 0 || endOdometer < startOdometer) {
    throw new Error(`Invalid odometer range: ${sourceId}`);
  }
  const unit = raw.mileAge?.unit;
  if (!['km', 'mi', 'mile'].includes(unit)) throw new Error(`Invalid distance unit: ${sourceId}`);
  const entry = {
    sourceId, driverId, vehicleId, driverName: text(raw.driver), startOdometer, endOdometer,
    distanceUnit: unit === 'km' ? 'km' : 'mi', reason: text(raw.reason),
    notes: typeof raw.details?.notes === 'string' ? raw.details.notes : '',
    tripType: raw.details?.businessTrip === true ? 'business' : 'personal',
    dateTime: date(raw.date), createdAt: date(raw.createdAt ?? raw._id.getTimestamp()),
    ...(raw.refuel ? { refueling: { quantity: number(raw.refuel.liters), totalPrice: number(raw.refuel.price), isFull: raw.refuel.isSpecial !== true } } : {}),
    ...(raw.service ? { service: { description: text(raw.service.message), cost: number(raw.service.price) } } : {}),
  };
  if (entry.reason.length > 500 || (entry.refueling && (entry.refueling.quantity <= 0 || entry.refueling.totalPrice < 0)) ||
      (entry.service && entry.service.cost < 0)) throw new Error(`Invalid source values: ${sourceId}`);
  return entry;
}

export function fingerprint(entry: ReturnType<typeof mapEntry>): string {
  return createHash('sha256').update(JSON.stringify(entry)).digest('hex');
}
