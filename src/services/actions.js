import React from 'react'

export default class Actions extends React.Component {
  changeMovieRate = (id, rating, context) => {
    if (rating > 0) {
      context.movieServices.addRatedFilm(id, rating, context)
      context.movieServices.getRatedMovie(context)
      context.localRatedMovieDB[id] = rating
    } else {
      context.movieServices.removeRatedFilm(context, id)
      context.movieServices.getRatedMovie(context)
      delete context.localRatedMovieDB[id]
    }
  }
}
