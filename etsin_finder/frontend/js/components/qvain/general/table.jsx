import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
`;

export const TableHeader = styled.thead`
  border-bottom: 1px solid black;
  font-weight: bold;
  padding-bottom: 10px;
`;

export const TableBody = styled.tbody`
  padding-top: 10px;
  padding-bottom: 10px;
  & > ${Row}:hover {
    ${props => (props.striped ? 'background-color: #e5e5e5;' : '')}
  }
`;

export const Row = styled.tr`
  padding: inherit;
`;

export const HeaderCell = styled.th`
  padding: inherit;
`;

export const BodyCell = styled.td`
  padding: inherit;
`;

export const TableNote = styled.p`
  &:hover {
    background-color: inherit;
  }
`
