import type { Country } from "../data/types";
import { renderMapSvgMarkup } from "../components/MapView";

type ExportMapOptions = {
  countries: Country[];
  countryColors: Map<string, string>;
  centerLongitude: number;
  width: number;
  height: number;
  transparentBackground: boolean;
};

type SaveFilePicker = (options?: {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}) => Promise<FileSystemFileHandle>;

type FileSystemFileHandle = {
  createWritable: () => Promise<FileSystemWritableFileStream>;
};

type FileSystemWritableFileStream = {
  write: (data: Blob) => Promise<void>;
  close: () => Promise<void>;
};

export async function exportMapPng(options: ExportMapOptions): Promise<void> {
  const svgMarkup = renderMapSvgMarkup(options);
  const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to create canvas context.");
    }

    context.drawImage(image, 0, 0, options.width, options.height);
    const pngBlob = await canvasToBlob(canvas);
    await savePngBlob(pngBlob);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to render SVG for export."));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Unable to create PNG image."));
      }
    }, "image/png");
  });
}

async function savePngBlob(blob: Blob): Promise<void> {
  const showSaveFilePicker = (window as Window & { showSaveFilePicker?: SaveFilePicker }).showSaveFilePicker;

  if (showSaveFilePicker) {
    const fileHandle = await showSaveFilePicker({
      suggestedName: "world-map-groups.png",
      types: [
        {
          description: "PNG image",
          accept: {
            "image/png": [".png"]
          }
        }
      ]
    });
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  const pngUrl = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "world-map-groups.png";
    link.click();
  } finally {
    URL.revokeObjectURL(pngUrl);
  }
}
