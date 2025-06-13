export interface Point {
  id: number;
  mpId: number;
  coords: string;
  pic: string;
  encryption: {
    key: string;
  };
}

export interface Path {
  pathId: number;
  name: string;
  pointList: Point[];
}
