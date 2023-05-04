import React from "react";
import PropTypes from "prop-types";
import { Card, Rate } from "antd";
import "./movie.css";
import { format } from "date-fns";
import Score from "../vote/vote";
import Vote from "../vote/vote";
import genresContext from "../genresContext";
export default class Movie extends React.Component {
  ratedMovie = {};
  render() {
    const {
      id,
      date,
      title,
      overview,
      poster,
      genresIds,
      // genres,
      movieRate,
      onChangeMovieRate,
      localRatedMovieDB,
      vote,
    } = this.props;
    const formattedDate = date ? format(new Date(date), "MMMM dd, yyyy") : "";

    // let genreMap = new Map();

    // genres.map((genre) => {
    //   genreMap.set(genre.id, genre.name);
    // });

    let movieMap = new Map();
    movieRate.map((movie) => {
      movieMap.set(movie.id, movie.rating);
    });

    return (
      <genresContext.Consumer>
        {(genres) => {
          return (
            <Card
              hoverable
              cover={
                <img
                  src={poster}
                  alt={title}
                  title={title}
                  className="movie_img"
                ></img>
              }
              className="movie"
            >
              <div className="movie_info">
                <h3 className="movie_tittle">{title}</h3>
                <Vote vote={vote}></Vote>
                <h5 className="movie_date">{formattedDate}</h5>
                <ul className="movie_genres">
                  {genresIds.map((genresId) => {
                    return (
                      <li key={genresId} className="movie_genres-genre">
                        {/* {genreMap.get(genresId)} */}
                        {(() => {
                          let a = genres.filter((item) => item.id == genresId);
                          return a[0].name;
                        })()}
                      </li>
                    );
                  })}
                </ul>
                <p className="movie_summary">{overview}</p>
                <Rate
                  className="rate"
                  value={localRatedMovieDB[id]}
                  count={10}
                  onChange={(e) => {
                    onChangeMovieRate(id, e);
                  }}
                />
              </div>
            </Card>
          );
        }}
      </genresContext.Consumer>
    );
  }
}
