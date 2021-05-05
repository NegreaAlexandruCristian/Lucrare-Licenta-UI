export class Institution {
  public name: string;
  public code: string;
  public latitude: number;
  public longitude: number;

  constructor(
    name: string,
    code: string,
    latitude: number,
    longitude: number
  ) {
    this.name = name;
    this.code = code;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
