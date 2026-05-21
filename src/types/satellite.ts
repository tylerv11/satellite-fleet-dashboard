export type Satellite = {
  id: string
  name: string
  country: string
  operator: string
  purpose: 'Communications' | 'Earth Observation' | 'Navigation' | 'Technology Development' | 'Reconnaissance'
  orbitClass: 'LEO' | 'MEO' | 'GEO' | 'Elliptical'
  launchDate: string
  expectedLifetimeYears: number
  dryMassKg: number
  powerWatts: number
  status: 'Operational' | 'Degraded' | 'End of Life'
  launchVehicle: string
  latitude: number
  longitude: number
  altitudeKm: number
  altitudeNorm: number
}

export type Filters = {
  country: string
  purpose: string
  orbitClass: string
  status: string
}
