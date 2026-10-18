export interface CarouselItem {
  _id: string;

  imageUrl: string;

  bandName?: string;

  songName?: string;

  releaseDate?: string;

  buttonText?: string;

  buttonLink?: string;

  /**
   * Persistent administrator-defined
   * carousel position.
   */
  order: number;

  formattedDate?: string;
}