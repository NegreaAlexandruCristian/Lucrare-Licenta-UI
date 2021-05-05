export class Point {
  public code: string;
  public radius: number;
  public latitude: number;
  public longitude: number;

  constructor(
    code: string,
    radius: number,
    latitude: number,
    longitude: number
  ) {
    this.code = code;
    this.radius = radius;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
