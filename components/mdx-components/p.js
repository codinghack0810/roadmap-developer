import styled from 'styled-components';

const P = styled.p`
  color: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 16px 0;
  
  img + em { 
    display: block; 
    text-align: center;
    color: #666666;
    font-style: normal;
    font-size: 14px;
    margin: 5px 0 10px;
    display: block;
  } 
`;

export default P;