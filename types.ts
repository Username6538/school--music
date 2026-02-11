
export interface Song {
  id: string; // Typically "Artist - Title" for unique matching
  title: string;
  artist: string;
  genre: string;
}

export interface VoteRecord {
  song: Song;
  votes: number;
}
