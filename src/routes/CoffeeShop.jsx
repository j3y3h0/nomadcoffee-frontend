import React from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import CoffeeShopDetail from "../components/CoffeeShopDetail";

//#region Style
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px 0;
`;

const Loading = styled.h1`
  font-weight: 600;
  font-size: 28px;
  margin: 20px 0 0 20px;
`;
//#endregion

//#region GraphQL
const SEE_COFFEE_SHOP_QUERY = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      user {
        id
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
      isMine
    }
  }
`;
//#endregion

function CoffeeShop() {
  const { id } = useParams();

  const { data, loading } = useQuery(SEE_COFFEE_SHOP_QUERY, {
    variables: {
      id: parseInt(id),
    },
  });

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Container>
          <CoffeeShopDetail obj={data?.seeCoffeeShop} />
        </Container>
      )}
    </>
  );
}

export default CoffeeShop;
