export type FeaturedMovie = {
  id: string;
  title: string;
  year: string;
  rating: string;
  tagline: string;
  /** Two CSS colors used for the gradient backdrop when no poster is available. */
  palette: readonly [string, string];
};

export const FEATURED_MOVIES: readonly FeaturedMovie[] = [
  {
    id: "tt1375666",
    title: "Inception",
    year: "2010",
    rating: "8.8",
    tagline: "Your mind is the scene of the crime.",
    palette: ["#1e3a5f", "#0b1320"],
  },
  {
    id: "tt0468569",
    title: "The Dark Knight",
    year: "2008",
    rating: "9.0",
    tagline: "Why so serious?",
    palette: ["#3b2f2f", "#0d0b0b"],
  },
  {
    id: "tt0816692",
    title: "Interstellar",
    year: "2014",
    rating: "8.7",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    palette: ["#4a3b1f", "#0e0c08"],
  },
  {
    id: "tt0245429",
    title: "Spirited Away",
    year: "2001",
    rating: "8.6",
    tagline: "A world of spirits, one brave girl.",
    palette: ["#5b1f2e", "#140a0e"],
  },
  {
    id: "tt6751668",
    title: "Parasite",
    year: "2019",
    rating: "8.5",
    tagline: "Act like you own the place.",
    palette: ["#23402f", "#09110c"],
  },
  {
    id: "tt1856101",
    title: "Blade Runner 2049",
    year: "2017",
    rating: "8.0",
    tagline: "The key to the future is finally unearthed.",
    palette: ["#6b3412", "#140904"],
  },
];
