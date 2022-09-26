import styled from 'styled-components';

// could have emphasised on using Material UI or something nice, but since challenge is 30-60 kept it basic

const ColumnCenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Container = styled(ColumnCenteredDiv)`
  padding-top: 64px;
  gap: 64px;
`;

export const ElementsWrapper = styled(ColumnCenteredDiv)`
  gap: 10px;
`;
