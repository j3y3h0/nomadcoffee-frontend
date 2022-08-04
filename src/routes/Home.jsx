import { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import { FatText } from "../components/shared";
import Avatar from "../components/Avatar";
import LoadingComponent from "../components/Loading";
import { useHistory } from "react-router-dom";

//#region Style
const LoadingArea = styled.div`
  width: 150px;
  height: 150px;
`;

const CoffeeShopsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1000px;
`;

const CafeContainer = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 4px;
  margin: 50px 15px;
  max-width: 250px;
  max-height: 400px;
  cursor: pointer;
`;

const ShopFooter = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
  color: ${(props) => props.theme.fontColor};
`;

const CafeImage = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

const ShopInfo = styled.div`
  padding: 12px 15px;
`;

const ShopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
  span {
    font-size: 17px;
    font-weight: 600;
  }
`;
//#endregion

//#region GraphQL
const HOME_QUERY = gql`
  query seeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
      id
      name
      user {
        id
        username
        name
        avatarUrl
      }
      photos {
        id
        url
      }
      categories {
        id
        name
        slug
      }
    }
  }
`;
//#endregion

function Home() {
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setPage] = useState(1);
  const history = useHistory();
  const { data, loading } = useQuery(HOME_QUERY, {
    variables: { page: currentPage },
  });

  const handleImgError = (event) => {
    event.target.scr = "/images/no-image.jpg";
  };

  const handleProfileError = (event) => {
    event.target.scr = "/images/no-profile.jpg";
  };

  console.log("data: ", data);

  return (
    <CoffeeShopsWrap>
      {loading && (
        <LoadingArea>
          <LoadingComponent />
        </LoadingArea>
      )}
      {data?.seeCoffeeShops?.map((row) => (
        <CafeContainer
          key={row.id}
          onClick={() => history.push(`/shop/${row.id}`)}
        >
          <ShopInfo>
            <ShopActions>
              <span>{row.name}</span>
            </ShopActions>
          </ShopInfo>
          <CafeImage src={row.photos[0]["url"]} onError={handleImgError} />
          <ShopFooter>
            <Avatar lg url={row.user.avatarUrl} onError={handleProfileError} />
            <Username>{row.user.name}</Username>
          </ShopFooter>
        </CafeContainer>
      ))}
    </CoffeeShopsWrap>
  );
}
export default Home;
