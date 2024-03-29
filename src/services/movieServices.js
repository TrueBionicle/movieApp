import axios from 'axios'

export default class MovieService {
  // GET

  makeGuestSession = async (context) => {
    await axios
      .get(`${context.url}/authentication/guest_session/new?${context.apiKey}`)
      .then((result) => {
        if (result.status < 400) {
          window.localStorage.setItem('guest_session_id', result.data.guest_session_id)
          context.setState({ guest_session_id: result.data.guest_session_id })
        }
      })
      .catch((error) => {
        context.setState({
          isError: true,
          errorMessage: 'Ну удалось создать сессию ' + error.message,
        })
        throw Error('Ну удалось создать сессию ' + error)
      })
  }

  getMovies = async (context, query, pageNumber) => {
    await axios
      .get(`${context.url}/search/movie?${context.apiKey}&language=ru-RU&query=${query}&page=${pageNumber}`)
      .then((result) => {
        if (result.status < 400) {
          context.setState({
            results: result.data.results,
            isLoading: false,
            total_results: result.data.total_results,
            searchValue: query,
            currentPage: pageNumber,
          })
        }
      })
      .catch((error) => {
        context.setState({
          isError: true,
          errorMessage: 'Не удалось получить список фильмов. Попробуйте еще раз - ' + error.message,
        })
        throw new Error('Не удалось получить список фильмов. Попробуйте еще раз ' + error)
      })
  }

  setRatedMovie = async (context) => {
    if (context.state.guest_session_id) {
      await axios
        .get(
          `${context.url}/guest_session/${context.state.guest_session_id}/rated/movies?${context.apiKey}&language=ru-RU&sort_by=created_at.asc`
        )
        .then((result) => {
          if (result.status < 400) {
            result.data.results.forEach((movie) => {
              context.localRatedMovieDB[movie.id] = movie.rating
            })
          }
        })
        .catch((error) => {
          console.log(error.message)
          context.setState({
            isError: true,
            errorMessage: 'Не удалось получить список оцененных фильмов - ' + error.message,
          })
          throw new Error('Не удалось получить список оцененных фильмов ' + error)
        })
    }
  }

  getGenres = async (context) => {
    await axios
      .get('https://api.themoviedb.org/3/genre/movie/list?api_key=00290063ec3b3c07a8c6adf6f7836f1a&language=ru-RU')
      .then((result) => {
        if (result.status < 400) {
          context.setState({ genres: result.data.genres })
        }
      })
      .catch((error) => {
        context.setState({
          isError: true,
          errorMessage: 'Не удалось загрузить список жанров - ' + error.message,
        })
        throw Error('Не удалось загрузить список жанров ' + error)
      })
  }

  getRatedMovie = async (context) => {
    if (context.state.guest_session_id) {
      await axios
        .get(
          `${context.url}/guest_session/${context.state.guest_session_id}/rated/movies?${context.apiKey}&language=ru-RU&sort_by=created_at.asc`
        )
        .then((result) => {
          if (result.status < 400) {
            if (Object.keys(context.localRatedMovieDB).length == result.data.results.length) {
              context.setState({
                getRated: result.data.results,
                isLoadingRated: false,
              })
            } else {
              context.setState({ isLoadingRated: true })
              context.movieServices.getRatedMovie(context)
            }
          }
        })
        .catch((error) => {
          console.log(error)
          context.setState({
            isError: true,
            errorMessage: 'Не удалось получить список оцененных фильмов  - ' + error.message,
          })
          throw Error('Не удалось получить список оцененных фильмов  - ' + error)
        })
    }
  }

  //POST

  addRatedFilm = (id, rating, context) => {
    axios
      .post(`${context.url}/movie/${id}/rating?${context.apiKey}&guest_session_id=${context.state.guest_session_id}`, {
        value: rating,
      })
      .catch((error) => {
        context.setState({
          isError: true,
          errorMessage: 'Не удалось добавить фильм в оцененные ' + error.message,
        })
        throw Error('Не удалось добавить фильм в оцененные ' + error)
      })
  }

  removeRatedFilm = (context, id) => {
    axios
      .delete(`${context.url}/movie/${id}/rating?${context.apiKey}&guest_session_id=${context.state.guest_session_id}`)
      .catch((error) => {
        context.setState({
          isError: true,
          errorMessage: 'Не удалось добавить фильм в оцененные - ' + error.message,
        })
        throw Error('Не удалось добавить фильм в оцененные ' + error)
      })
  }
}
