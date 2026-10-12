export type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type OmdbSearchSuccess = {
  Response: "True";
  Search: OmdbSearchItem[];
  totalResults: string;
};

export type OmdbSearchFailure = {
  Response: "False";
  Error: string;
};

export type OmdbSearchResponse = OmdbSearchSuccess | OmdbSearchFailure;
