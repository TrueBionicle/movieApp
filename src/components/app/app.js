import React from 'react'
import axios from 'axios'
import { Pagination, Spin, Tabs } from 'antd'

import './app.css'
import 'antd/dist/reset.css'
import genresContext from '../genresContext'

import Search from './../search/search'
import Movie from './../movie/movie'

export default class App extends React.Component {
  localRatedMovieDB = {}
  state = {
    isLoading: true,
    isLoadingRated: true,
    results: [],
    itemPerPage: 6,
    getRated: [],
  }

  setPaginationOptions = (e = 1) => {
    const currentPage = e
    const lastItemIndex = currentPage * this.state.itemPerPage
    const firstItemIndex = lastItemIndex - this.state.itemPerPage

    this.setState({
      lastItemIndex,
      firstItemIndex,
      currentPage,
    })
  }

  resetPaginationOptions = () => {
    this.setState({
      currentPage: 1,
      firstItemIndex: 0,
      lastItemIndex: this.state.itemPerPage,
    })
  }

  getGenres = async () => {
    const {
      data: { genres },
    } = await axios.get(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=00290063ec3b3c07a8c6adf6f7836f1a&language=ru-RU'
    )
    console.log(genres)
    this.setState({ genres })
  }

  getMovies = async (query = 'Агент') => {
    const info = {
      url: 'https://api.themoviedb.org/3/search/movie?',
      apiKey: 'api_key=00290063ec3b3c07a8c6adf6f7836f1a',
    }
    const {
      data: { results },
    } = await axios.get(`${info.url}${info.apiKey}&language=ru-RU&query=${query}`)
    this.setState({ results, isLoading: false })
    this.resetPaginationOptions()
  }

  makeGuestSession = async () => {
    console.log('Получаем гостевой запрос')
    const {
      data: { guest_session_id },
    } = await axios.get(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=00290063ec3b3c07a8c6adf6f7836f1a'
    )
    this.setState({ guest_session_id })
    console.log(guest_session_id)
  }

  changeMovieRate = (id, rating) => {
    console.log(id, rating)
    if (rating > 0) {
      this.addRatedFilm(id, rating)
      this.localRatedMovieDB[id] = rating
      this.getRatedMovie()
    } else {
      delete this.localRatedMovieDB[id]
      this.removeRatedFilm(id)
      this.getRatedMovie()
    }
  }

  addRatedFilm = (id, rating) => {
    axios.post(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=00290063ec3b3c07a8c6adf6f7836f1a&guest_session_id=${this.state.guest_session_id}`,
      {
        value: rating,
      }
    )
  }

  removeRatedFilm = (id) => {
    axios.delete(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=00290063ec3b3c07a8c6adf6f7836f1a&guest_session_id=${this.state.guest_session_id}`
    )
  }

  getRatedMovie = async () => {
    if (this.state.guest_session_id) {
      await axios
        .get(
          `https://api.themoviedb.org/3/guest_session/${this.state.guest_session_id}/rated/movies?api_key=00290063ec3b3c07a8c6adf6f7836f1a&language=ru-RU&sort_by=created_at.asc`
        )
        .then((result) => {
          if (Object.keys(this.localRatedMovieDB).length == result.data.results.length) {
            this.setState({
              getRated: result.data.results,
              isLoadingRated: false,
            })
          } else {
            this.setState({ isLoadingRated: true })
            this.getRatedMovie()
          }
        })
    }
    console.log(this.localRatedMovieDB)
    console.log(this.state.getRated.length)
  }

  componentDidMount() {
    this.makeGuestSession()
    this.setPaginationOptions()
    this.getGenres()
    this.getMovies()
  }

  render() {
    console.log('Рендер...')
    const { isLoading, isLoadingRated, results, genres, lastItemIndex, firstItemIndex, getRated } = this.state
    const localRatedMovieDB = this.localRatedMovieDB
    const currentIndex = results.slice(firstItemIndex, lastItemIndex)
    const currentIndex2 = getRated.slice(firstItemIndex, lastItemIndex)
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div>
            <Search getMovies={this.getMovies} />
            <div className="container">
              {isLoading ? (
                <div className="spin">
                  <Spin size="large" />
                </div>
              ) : (
                currentIndex.map((item) => {
                  return (
                    <Movie
                      key={item.id}
                      id={item.id}
                      date={item.release_date}
                      title={item.title}
                      overview={item.overview}
                      poster={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : `http://placehold.it/100x150&text=${item.title}`
                      }
                      genresIds={item.genre_ids}
                      // genres={genres}
                      movieRate={getRated}
                      onChangeMovieRate={this.changeMovieRate}
                      onGetRatedMovie={this.getRatedMovie}
                      onPost={this.post}
                      localRatedMovieDB={localRatedMovieDB}
                      vote={item.vote_average}
                    />
                  )
                })
              )}
            </div>
            <div className="pagination-move-center">
              <Pagination
                total={this.state.results.length}
                pageSize={this.state.itemPerPage}
                current={this.state.currentPage}
                onChange={this.setPaginationOptions}
              />
            </div>
          </div>
        ),
      },
      {
        key: '2',
        label: 'Rated',
        disabled: Object.keys(this.localRatedMovieDB).length == 0 ? true : false,
        children: (
          <div>
            <div className="container">
              {isLoadingRated ? (
                <div className="spin">
                  <Spin size="large" />
                </div>
              ) : (
                currentIndex2.map((item) => {
                  return (
                    <Movie
                      key={item.id}
                      id={item.id}
                      date={item.release_date}
                      title={item.title}
                      overview={item.overview}
                      poster={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : `http://placehold.it/100x150&text=${item.title}`
                      }
                      genresIds={item.genre_ids}
                      // genres={genres}
                      movieRate={getRated}
                      onChangeMovieRate={this.changeMovieRate}
                      onGet={this.getM}
                      onPost={this.post}
                      localRatedMovieDB={localRatedMovieDB}
                      vote={item.vote_average}
                    />
                  )
                })
              )}
            </div>

            <Pagination
              total={getRated.length}
              current={this.state.currentPage}
              pageSize={this.state.itemPerPage}
              onChange={this.setPaginationOptions}
            />
          </div>
        ),
      },
    ]

    return (
      <div className="app">
        <genresContext.Provider value={genres}>
          <Tabs
            size="large"
            className="tabs"
            items={items}
            onChange={this.getRatedMovie}
            onTabClick={() => {
              this.resetPaginationOptions()
            }}
          ></Tabs>
        </genresContext.Provider>
      </div>
    )
  }
}
