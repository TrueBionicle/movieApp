import React from 'react'

export default class Actions extends React.Component {
  changeMovieRate = (id, rating, context) => {
    if (rating > 0) {
      context.movieServices.addRatedFilm(id, rating, context)
      context.localRatedMovieDB[id] = rating
      context.movieServices.getRatedMovie(context)
    } else {
      delete context.localRatedMovieDB[id]
      context.movieServices.removeRatedFilm(context, id)
      context.movieServices.getRatedMovie(context)
    }
  }
}
