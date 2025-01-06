import React from "react";

function SearchBox(props) {
  function handleChange(e) {
    // e.target.value 입력창 적은 내용 (입력값)
    props.setSearchValue(e.target.value);
  }
  return (
    <div className="col col-sm-4">
      <input
        value={props.searchValue}
        onChange={handleChange}
        className="form-control"
        placeholder="영화 검색..."
      ></input>
    </div>
  );
}

export default SearchBox;
