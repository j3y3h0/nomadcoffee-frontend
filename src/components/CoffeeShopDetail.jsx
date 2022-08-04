import React, { useState } from "react";
import { Link } from "react-router-dom";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled, { css } from "styled-components";
import { gql, useMutation } from "@apollo/client";
import Avatar from "./Avatar";

//#region Style
const CoffeeShopBox = styled.div`
  width: 90%;
  height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  overflow: hidden;
`;

const TitleContainer = styled.div`
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;

const UserTab = styled(Link)`
  height: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-left: 20px;
`;

const Username = styled.h3`
  margin-left: 10px;
  margin-bottom: 2px;
  font-weight: 500;
`;

const Title = styled(Link)`
  margin-left: 10px;
  margin-bottom: 4px;
  font-size: 18px;
  color: ${(props) => props.theme.accent};
  font-weight: 600;
  text-decoration: none;
`;

const AdminPannel = styled.div`
  position: absolute;
  display: flex;
  right: 20px;
`;

const PannelBtn = styled.div`
  cursor: pointer;
  margin-left: 20px;
  & > svg {
    background-color: transparent !important;
  }
`;

const DescContainer = styled.div`
  display: flex;
  width: 100%;
  height: 440px;
`;

const DescMainContainer = styled.div`
  position: relative;
  width: 70%;
  height: 100%;
`;

const MainImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.fontColor};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.2s ease-in-out;
`;

const MainImageControl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
  height: 100%;
  top: 0;
  cursor: pointer;
  position: absolute;
  background-color: rgba(200, 200, 200, 0.4);
  opacity: 0.03;
  transition: opacity 0.2s ease-out;
  ${(props) =>
    props.direction === "left"
      ? css`
          left: 0;
          border-radius: 0 20px 20px 0;
        `
      : props.direction === "right"
      ? css`
          right: 0;
          border-radius: 20px 0 0 20px;
        `
      : null}
  &:hover {
    opacity: 1;
  }
  & * {
    color: #ffffff;
  }
`;

const DescDetailsContainer = styled.div`
  width: 30%;
  height: 100%;
  display: grid;
  grid-template-rows: 5fr 4fr 3.8fr;
  background-color: ${(props) => props.theme.bgColor};
`;

const DetailsObject = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 96%;
  height: 96%;
  overflow: auto;
  padding: 2%;
`;

const ObjectTitle = styled.h1`
  font-weight: 600;
  margin-bottom: 5px;
`;

const ObjectArray = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-radius: 8px;
  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.deepColor};
  }
  margin-bottom: 2px;
`;

const Photo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  background-color: ${(props) => props.theme.fontColor};
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 8px;
`;

const Category = styled.h1`
  width: fit-content;
  max-width: 90%;
  height: fit-content;
  padding: 10px;
  background-color: ${(props) => props.theme.deepColor};
  border-radius: 8px;
  overflow-wrap: break-word;
  font-weight: 600;
  line-height: 1.2rem;
`;
//#endregion

//#region GraphQL
const DELETE_COFFEE_SHOP_MUTATION = gql`
  mutation deleteCoffeeShop($id: Int!) {
    deleteCoffeeShop(id: $id) {
      ok
      error
    }
  }
`;
//#endregion

function CoffeeShopDetail({ obj }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [deleteCoffeeShop, { loading }] = useMutation(
    DELETE_COFFEE_SHOP_MUTATION,
    {
      variables: {
        id: obj.id,
      },
      update: (cache, result) => {
        console.log("cache: ", cache);
        console.log("result: ", result);
        const {
          data: {
            deleteCoffeeShop: { ok },
          },
        } = result;

        if (ok) {
          window.location.replace(`/`);
        }
      },
    }
  );

  const handleDelete = () => {
    if (!loading) {
      deleteCoffeeShop();
    }
  };

  const changeMainImage = (skip, object) => {
    if (skip !== 0) {
      if (skip <= -1 && !(mainImageIndex + skip < 0)) {
        setMainImageIndex(mainImageIndex + skip);
      } else if (skip >= 1 && !(mainImageIndex + skip >= object.length)) {
        setMainImageIndex(mainImageIndex + skip);
      }
    }
  };

  return (
    <CoffeeShopBox>
      <TitleContainer>
        <UserTab to="#">
          <Avatar url={obj.user.avatarUrl} size={35} />
          <Username>{obj.user.name}</Username>
        </UserTab>
        <Title to="#">{obj.name}</Title>
        {obj.isMine && (
          <AdminPannel>
            <PannelBtn>
              <Link to={`/shop/${obj.id}/edit`}>
                <FontAwesomeIcon icon={faPenToSquare} size="1x" />
              </Link>
            </PannelBtn>
            <PannelBtn onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashCan} size="1x" />
            </PannelBtn>
          </AdminPannel>
        )}
      </TitleContainer>
      <DescContainer>
        <DescMainContainer>
          <MainImageControl
            onClick={() => changeMainImage(-1, obj.photos)}
            direction="left"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="1x" />
          </MainImageControl>
          <MainImage src={obj?.photos[mainImageIndex]?.url} />
          <MainImageControl
            onClick={() => changeMainImage(1, obj.photos)}
            direction="right"
          >
            <FontAwesomeIcon icon={faArrowRight} size="1x" />
          </MainImageControl>
        </DescMainContainer>
        <DescDetailsContainer>
          <DetailsObject>
            <ObjectTitle>사진</ObjectTitle>
            <ObjectArray>
              {obj.photos.map((photo, index) => (
                <Photo key={index} src={photo.url} />
              ))}
            </ObjectArray>
          </DetailsObject>
          <DetailsObject>
            <ObjectTitle>카테고리</ObjectTitle>
            <ObjectArray>
              {obj.categories.map((category, index) => (
                <Category key={index}>{category.slug}</Category>
              ))}
            </ObjectArray>
          </DetailsObject>
        </DescDetailsContainer>
      </DescContainer>
    </CoffeeShopBox>
  );
}

export default CoffeeShopDetail;
