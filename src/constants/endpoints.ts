export const Endpoints = {
  movies: {
    popular: '/movie/popular',
    search: '/search/movie',
    details: (id: number) => `/movie/${id}`,
  },
};
export default Endpoints;
