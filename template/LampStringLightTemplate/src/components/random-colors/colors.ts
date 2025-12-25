export type ColorItem = { hue: number; saturation: number; value: number; hex: string };
export type RandomItem = { id: number; colors: ColorItem[] };

export const defaultRandomColors: RandomItem[] = [
  {
    id: 10 + 1,
    colors: [
      { hex: '#D798F8', hue: 279, saturation: 40, value: 97 },
      { hex: '#AB90F7', hue: 253, saturation: 44, value: 97 },
      { hex: '#A5E0F9', hue: 199, saturation: 33, value: 98 },
      { hex: '#ACC6FA', hue: 221, saturation: 34, value: 98 },
    ],
  },
  {
    id: 10 + 2,
    colors: [
      { hex: '#2164F4', hue: 224, saturation: 87, value: 96 },
      { hex: '#462AAB', hue: 252, saturation: 75, value: 67 },
      { hex: '#FEFA67', hue: 57, saturation: 59, value: 100 },
      { hex: '#E7335D', hue: 345, saturation: 79, value: 91 },
    ],
  },
  {
    id: 10 + 3,
    colors: [
      { hex: '#EC6C59', hue: 5, saturation: 63, value: 93 },
      { hex: '#F4B557', hue: 38, saturation: 65, value: 96 },
      { hex: '#58C5F7', hue: 203, saturation: 65, value: 97 },
      { hex: '#E6ED7A', hue: 65, saturation: 52, value: 93 },
    ],
  },
  {
    id: 10 + 4,
    colors: [
      { hex: '#E9A8BF', hue: 340, saturation: 27, value: 91 },
      { hex: '#ED6593', hue: 333, saturation: 59, value: 93 },
      { hex: '#E7335D', hue: 345, saturation: 79, value: 91 },
      { hex: '#EB3D73', hue: 345, saturation: 67, value: 92 },
    ],
  },
  {
    id: 10 + 5,
    colors: [
      { hex: '#D3EFFD', hue: 196, saturation: 17, value: 99 },
      { hex: '#A5E0F9', hue: 199, saturation: 33, value: 98 },
      { hex: '#58C5F7', hue: 203, saturation: 65, value: 97 },
      { hex: '#78D4F8', hue: 200, saturation: 52, value: 97 },
    ],
  },
  {
    id: 10 + 6,
    colors: [
      { hex: '#462AAB', hue: 252, saturation: 75, value: 67 },
      { hex: '#2164F4', hue: 224, saturation: 87, value: 96 },
      { hex: '#FFF681', hue: 56, saturation: 100, value: 100 },
      { hex: '#AF49EB', hue: 282, saturation: 66, value: 92 },
    ],
  },
  {
    id: 10 + 7,
    colors: [
      { hex: '#EC6C59', hue: 5, saturation: 63, value: 93 },
      { hex: '#F4B557', hue: 38, saturation: 65, value: 96 },
      { hex: '#58C5F7', hue: 203, saturation: 65, value: 97 },
      { hex: '#E6ED7A', hue: 65, saturation: 52, value: 93 },
    ],
  },
  {
    id: 10 + 8,
    colors: [
      { hex: '#F3AE3D', hue: 38, saturation: 73, value: 95 },
      { hex: '#F4B557', hue: 38, saturation: 65, value: 96 },
      { hex: '#F8DAAE', hue: 38, saturation: 31, value: 97 },
      { hex: '#F7C882', hue: 38, saturation: 48, value: 97 },
    ],
  },
  {
    id: 10 + 9,
    colors: [
      { hex: '#AB90F7', hue: 253, saturation: 44, value: 97 },
      { hex: '#7D58F3', hue: 253, saturation: 65, value: 95 },
      { hex: '#462AAB', hue: 252, saturation: 75, value: 67 },
      { hex: '#5639E1', hue: 248, saturation: 78, value: 88 },
    ],
  },
  {
    id: 10 + 10,
    colors: [
      { hex: '#86B853', hue: 87, saturation: 57, value: 72 },
      { hex: '#57C3F5', hue: 197, saturation: 66, value: 96 },
      { hex: '#7D58F3', hue: 253, saturation: 65, value: 95 },
      { hex: '#57C3F5', hue: 197, saturation: 66, value: 96 },
    ],
  },
];
