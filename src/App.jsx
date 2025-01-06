import { useEffect, useState } from "react";
import MovieList from "./components/MovieList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import ScrollContainer from "react-indiana-drag-scroll";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]); // 선호작 영화
  // 서버에서 검색한 영화들 데이터를 가져옴
  async function getMovieRequest(s) {
    const url = `http://www.omdbapi.com/?apikey=27a22a87&s=${s}`;
    const response = await fetch(url); // fetch Api - omdb 서버에서 데이터를 제이슨으로 받음
    const jsonData = await response.json(); // 제이슨문자열을 자바스크립트 객체로 받음
    console.log(jsonData);
    // 검색 결과가 없을경우에는 영화를 업데이트 하지 않음
    if (jsonData.Search != null && jsonData.Search.length > 0) {
      setMovies(jsonData.Search);
    }
  }
  // 앱 실행시 처음 한번만 실행 useEffect(실행함수, [])
  // [] < 안에 입력해서 검색어가 바뀔때마다 실행되는걸로 바뀜
  useEffect(() => {
    if (searchValue.length >= 3) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);
  // 처음 한번 실행 [], 브라우저 로컬스토리지에서 선호작 가져오기
  useEffect(() => {
    const movieLikes = JSON.parse(localStorage.getItem("favourites"));
    if (movieLikes) {
      setFavorites(movieLikes);
    }
  }, []);
  // 로컬에 저장하는 함수
  function saveToLocalStorage(items) {
    localStorage.setItem("favourites", JSON.stringify(items));
  }
  // 선호작 추가하는 함수
  function addFavoriteMovie(movie) {
    //중복 체크
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite.imdbID == movie.imdbID
    );

    if (isAlreadyFavorite) {
      alert("이미 선호작에 추가된 영화입니다!");
      return;
    }
    //중복 아니면 추가
    const newList = [...favorites, movie];
    setFavorites(newList); // 스테이트 업데이트
    saveToLocalStorage(newList); // 저장소 로컬스토리지에 저장
  }

  //선호작 제거 함수
  function removeMovie(movie) {
    // 필터를 써서 id가 같은 영화가 있으면 제거됨! 선호작과 그냥영화목록
    const newList = favorites.filter((fm) => fm.imdbID != movie.imdbID);

    setFavorites(newList);
    saveToLocalStorage(newList);
  }
  return (
    <div className="container-fluid movie-app">
      <div className="row align-items-center my-4">
        <MovieListHeading heading="영화검색과 선호작 등록" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <ScrollContainer className="row scroll-containern">
        <MovieList
          addMovie={true}
          movies={movies}
          handleClick={addFavoriteMovie}
        />
      </ScrollContainer>
      <div className="row align-items-center my-4">
        <MovieListHeading heading="내 선호작" />
      </div>
      <ScrollContainer className="row scroll-containern">
        <MovieList
          addMovie={false}
          movies={favorites}
          handleClick={removeMovie}
        />
      </ScrollContainer>
    </div>
  );
}

export default App;
