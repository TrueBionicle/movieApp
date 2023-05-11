import React from 'react'
import { Pagination, Spin, Tabs } from 'antd'

import './app.css'
import 'antd/dist/reset.css'
import genresContext from '../genresContext'
import MovieServices from '../../services/movieServices'
import Actions from '../../services/actions'

import Search from './../search/search'
import Movie from './../movie/movie'
export default class App extends React.Component {
  localRatedMovieDB = {}

  movieServices = new MovieServices()
  actions = new Actions()
  state = {
    isLoading: true,
    isLoadingRated: true,
    results: [],
    getRated: [],
    currentPage: 1,
    guest_session_id: window.localStorage.getItem('guest_session_id'),
  }

  url = 'https://api.themoviedb.org/3'
  apiKey = 'api_key=00290063ec3b3c07a8c6adf6f7836f1a'

  async componentDidMount() {
    try {
      if (window.localStorage.getItem('guest_session_id') == null) {
        await this.movieServices.makeGuestSession(this)
      } else {
        await this.movieServices.setRatedMovie(this)
      }
      await this.movieServices.getRatedMovie(this)
      await this.movieServices.getGenres(this)
      await this.movieServices.getMovies(this, 'Петя', 1)
    } catch (error) {
      alert('Не удалось подключиться к сети. Попробуйте еще раз')
    }
  }

  render() {
    const { isLoading, isLoadingRated, results, genres, getRated } = this.state
    const localRatedMovieDB = this.localRatedMovieDB
    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <div>
            <Search onSearch={this.movieServices.getMovies} context={this} />
            <div className="container">
              {isLoading ? (
                <div className="spin">
                  <Spin size="large" />
                </div>
              ) : (
                results.map((item) => {
                  return (
                    <Movie
                      key={item.id}
                      id={item.id}
                      releaseDate={item.release_date}
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
                      onChangeMovieRate={this.actions.changeMovieRate}
                      onPost={this.post}
                      localRatedMovieDB={localRatedMovieDB}
                      vote={item.vote_average}
                      context={this}
                    />
                  )
                })
              )}
            </div>
            <div className="pagination-move-center">
              <Pagination
                total={this.state.total_results}
                pageSize={20}
                current={this.state.currentPage}
                onChange={(e) => {
                  this.movieServices.getMovies(this, this.state.searchValue, e)
                }}
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
                getRated.map((item) => {
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
                      onChangeMovieRate={this.actions.changeMovieRate}
                      onGet={this.getM}
                      onPost={this.post}
                      localRatedMovieDB={localRatedMovieDB}
                      vote={item.vote_average}
                      context={this}
                    />
                  )
                })
              )}
            </div>

            <Pagination total={getRated.length} pageSize={20} />
          </div>
        ),
      },
    ]

    return (
      <div className="app">
        <genresContext.Provider value={genres}>
          <Tabs size="large" className="tabs" items={items} onChange={this.getRatedMovie}></Tabs>
        </genresContext.Provider>
      </div>
    )
  }
}
