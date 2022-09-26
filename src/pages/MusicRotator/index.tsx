import axios from 'axios';
import debouce from 'lodash.debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { API_CALL_HEADERS, DELAY, INITIAL_MUSIC_LIST, ITUNES_API_BASE } from './constants';
import { Container, ElementsWrapper } from './styles';
import { getAlbumNames, rotateToLeft } from './utils';

export default function MusicRotator() {
  const [elements, setElements] = useState<string[]>(INITIAL_MUSIC_LIST);
  const [quedElements, setQuedElements] = useState<string[]>([]);
  const [searchedInput, setSearchedInput] = useState('');

  let timer = useRef<any>(null);

  const handleOnChange = (event: any) => {
    const { value } = event.target;
    setSearchedInput(value);
  };

  const debouncedOnChange = useMemo(() => debouce(handleOnChange, 300), []);

  useEffect(() => {
    if (searchedInput) {
      let isCancelled = false; // this one can be improved to fetch signals, to be put to off, so we also stop the call, but went for this one since code challenge timeframe is like 30-60mins
      axios
        .get(`${ITUNES_API_BASE}?term=${searchedInput}`, {
          headers: API_CALL_HEADERS,
        })
        .then((res) => {
          const results = res.data.results;
          const albumNames = getAlbumNames(results);
          const shouldAddToQue = albumNames.length > 0 && !isCancelled;

          if (shouldAddToQue) {
            setQuedElements(albumNames);
          }
        });

      return () => {
        isCancelled = true;
        setQuedElements([]);
      };
    }
  }, [searchedInput]);

  useEffect(() => {
    let shiftedElements = rotateToLeft(elements);

    if (quedElements.length > 0) {
      shiftedElements[shiftedElements.length - 1] = quedElements[0];
      const newQuedElements = [...quedElements].slice(1);
      setQuedElements(newQuedElements);
    }

    timer.current = setInterval(
      () => setElements(shiftedElements),
      DELAY * 1000
    );

    // clear on component unmount
    return () => {
      clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  });

  return (
    <Container>
      <input type="text" onChange={debouncedOnChange} />
      <ElementsWrapper>
        {elements.map((element, index) => (
          <div key={element + index}>
            {element} <br />
          </div>
        ))}
      </ElementsWrapper>
    </Container>
  );
}
