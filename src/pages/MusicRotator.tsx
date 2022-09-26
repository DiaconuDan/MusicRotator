import axios from 'axios';
import debounce from 'lodash.debounce';
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
  let timer = useRef<any>(null); // we can save timer in useRef and pass it to child

  const handleOnChange = (event: any) => {
    console.log('intrat', event.target.value);
    const { value } = event.target;
    setSearchedInput(value);
  };

  const debouncedOnChange = useMemo(() => {
    return debounce(handleOnChange, 300);
  }, []);

  useEffect(() => {
    axios
      .get(`https://itunes.apple.com/search?term=${searchedInput}`)
      .then((res) => {
        const persons = res.data;
        console.log('res', res);
      });
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
      <input type="text" value={searchedInput} onChange={debouncedOnChange} />
      <ElementsWrapper>
        {elements.map((element) => (
          <div>
            {element} <br />
          </div>
        ))}
      </ElementsWrapper>
      <Child counter={0} currentTimer={timer.current} />
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

function Child(props: TableProps) {
  const { counter, currentTimer } = props;
  // this will clearInterval in parent component after counter gets to 5
  useEffect(() => {
    // if (counter < 5) return;
    clearInterval(currentTimer);
  }, [counter, currentTimer]);

  return null;
}
