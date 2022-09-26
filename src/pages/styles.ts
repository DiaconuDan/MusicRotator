import styled from 'styled-components';

// could have emphasised on using Material UI or something nice

const ColumnCenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Wrapper = styled(ColumnCenteredDiv)`
  padding-top: 64px;
  gap: 64px;
`;

export const ElementsWrapper = styled(ColumnCenteredDiv)`
  gap: 10px;
`;
