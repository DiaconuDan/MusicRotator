import axios from 'axios';
import debouce from 'lodash.debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { DELAY, INITIAL_MUSIC_LIST } from './constants';
import { ElementsWrapper, Wrapper } from './styles';
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
        .get(`https://itunes.apple.com/search?term=${searchedInput}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        })
        .then((res) => {
          const results = res.data.results;
          const albumNames = getAlbumNames(results);

          if (albumNames.length > 0 && !isCancelled) {
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
    <Wrapper>
      <input type="text" onChange={debouncedOnChange} />
      <ElementsWrapper>
        {elements.map((element, index) => (
          <div key={element + index}>
            {element} <br />
          </div>
        ))}
      </ElementsWrapper>
    </Wrapper>
  );
}
