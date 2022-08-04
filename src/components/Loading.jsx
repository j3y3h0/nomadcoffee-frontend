import styled from "styled-components";

const LoadingCircle = styled.img`
  width: 100%;
  height: 100%;
`;

function LoadingComponent() {
  return <LoadingCircle src="/images/loading-spinner.gif" />;
}
export default LoadingComponent;
