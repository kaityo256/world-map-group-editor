import type { ColorPalette } from "./types";

export const colorPalettes: ColorPalette[] = [
  {
    id: "standard",
    name: "Standard",
    colors: [
      "#4E79A7",
      "#F28E2B",
      "#59A14F",
      "#E15759",
      "#B07AA1",
      "#76B7B2",
      "#EDC948",
      "#9C755F",
      "#FF9DA7",
      "#BAB0AC",
      "#8CD17D",
      "#A0CBE8"
    ]
  },
  {
    id: "colorblind",
    name: "Colorblind Friendly",
    colors: ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#999999"]
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      "#A6CEE3",
      "#B2DF8A",
      "#FDBF6F",
      "#CAB2D6",
      "#FFFF99",
      "#FB9A99",
      "#1F78B4",
      "#33A02C",
      "#FF7F00",
      "#6A3D9A",
      "#B15928",
      "#BDBDBD"
    ]
  },
  {
    id: "vivid",
    name: "Vivid",
    colors: ["#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD", "#17BECF", "#BCBD22", "#E377C2", "#8C564B", "#7F7F7F"]
  },
  {
    id: "muted",
    name: "Muted",
    colors: [
      "#5B7C99",
      "#C58A4A",
      "#6F9A70",
      "#B66A6A",
      "#8A7EA8",
      "#6FA6A3",
      "#C7B45A",
      "#8B7567",
      "#B7899A",
      "#9A9A9A",
      "#7F9F8C",
      "#8DA9C4"
    ]
  }
];

export const defaultPalette = colorPalettes[0];
