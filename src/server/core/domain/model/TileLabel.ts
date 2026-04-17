export interface TileLabel {
    format: TileLabelFormat,
    value: string,
}

export enum TileLabelFormat {
    IMAGE_URL = "IMAGE_URL",
    CHARACTER = "CHARACTER"
};
