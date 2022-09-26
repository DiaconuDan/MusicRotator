import axios from 'axios';
import debouce from 'lodash.debounce';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  padding-top: 24px;
  gap: 32px;
`;

const ElementsWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  border: 1px solid red;

  gap: 10px;
`;

const delay = 2;
const initialList = ['A', 'B', 'C', 'D', 'E'];

export default function MusicRotator() {
  const [elements, setElements] = useState<string[]>(initialList);
  const [searchedInput, setSearchedInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  let timer = useRef<any>(null); // we can save timer in useRef and pass it to child
  console.log('searchedInput', searchedInput);
  const handleOnChange = (event: any) => {
    const { value } = event.target;
    setSearchedInput(value);
  };

  const debouncedOnChange = useMemo(() => debouce(handleOnChange, 300), []);

  useEffect(() => {
    if (searchedInput) {
      axios
        .get(`https://itunes.apple.com/search?term=${searchedInput}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          },
        })
        .then((res) => {
          console.log('res', res);
          const results = res.data.results;
          console.log('results', results);
          console.log('getAlbumNames', getAlbumNames(results));
        });
    }
  }, [searchedInput]);

  useEffect(() => {
    const shiftedElements = rotateToLeft(elements);

    timer.current = setInterval(
      () => setElements(shiftedElements),
      delay * 1000
    );

    // clear on component unmount
    return () => {
      clearInterval(timer.current);
    };
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
        {elements.map((element) => (
          <div>
            {element} <br />
          </div>
        ))}
      </ElementsWrapper>
    </Wrapper>
  );
}
interface TableProps {
  counter: number;
  currentTimer: any;
}

const rotateToLeft = (input: string[]) => {
  if (!input || input.length <= 1) return input;

  return input.slice(1, input.length).concat(input[0]);
};

const getAlbumNames = (albums: any[]) => {
  const MAX_ALBUMS = 5;

  const albumNames = albums.map((album) => album.collectionName).sort();
  const wantedAlbums = [...new Set([...albumNames])];

  if (!wantedAlbums.length) return [];

  if (wantedAlbums.length > MAX_ALBUMS)
    return wantedAlbums.splice(0, MAX_ALBUMS);

  return wantedAlbums;
};
