import React, { useState, useEffect, useRef } from "react";

import styles from "./LocationSearcher.module.scss";

import axios from "../../axios";

const LocationSearcher = (props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const [queriedResults, setQueriedResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        inputRef.current !== undefined &&
        enteredFilter === inputRef.current.value
      ) {
        const query = enteredFilter.length === 0 ? "" : `${enteredFilter}`;
        if (query !== "") {
          axios
            .get("maps/search/" + query)
            .then((response) => {
              setQueriedResults(response.data.predictions);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setQueriedResults([]);
        }
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef]);

  let results = null;
  if (queriedResults.length > 0) {
    results = (
      <div className={styles.ResultsDiv}>
        <ul>
          {queriedResults.map((answer, index) => {
            return (
              <li
                key={index}
                onClick={() => props.onSearchLocationHandler(answer)}
              >
                {answer.description}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <div className={styles.LocationSearcherDiv}>
      {results}
      <form>
        <input
          ref={inputRef}
          className={styles.InputElementSearchBar}
          placeholder="zoeken..."
          onChange={(event) => setEnteredFilter(event.target.value)}
        />
      </form>
    </div>
  );
};

export default LocationSearcher;
