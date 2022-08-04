import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useMutation, useQuery } from "@apollo/client";
import Layout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import ErrorText from "../components/auth/ErrorText";
import Input from "../components/auth/Input";

//#region Style
const Title = styled.h1`
  margin-top: 30px;
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 24px;
`;

const Form = styled.form`
  margin-top: 30px;
  width: 90%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 5%;
  margin-bottom: 30px;
`;

const ObjectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${(props) => props.theme.bgColor};
`;

const CategoryInput = styled(Input)`
  width: 101%;
  margin: -6px 0 0 -0.5%;
  padding-left: 18px;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

const CategoryList = styled.ul`
  width: 95.6%;
  padding: 2%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Category = styled.li`
  padding: 10px;
  display: flex;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 1000px;
`;

const CategoryContent = styled.span`
  cursor: default;
  font-weight: 600;
  margin-right: 4px;
`;

const RemoveCategory = styled.span`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  width: 10px;
  height: 10px;
  border: 2px solid ${(props) => props.theme.bgColor};
  border-radius: 50%;
`;

const Subtext = styled.h1`
  font-weight: 600;
  & b {
    font-weight: 700;
  }
  & strong {
    font-weight: 700;
    color: ${(props) => props.theme.accent};
    text-decoration: underline;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  width: 101%;
  height: 25px;
  display: block;
  cursor: pointer;
  margin: -6px 0 0 -0.5%;
  padding: 13px 0 0 0;
  padding-left: 18px;
  font-weight: 600;
  text-align: left;
  border-radius: 5px;
  background-color: #ffffff;
  color: #17191c;
  border: 1px solid ${(props) => props.theme.borderColor};
`;

const PhotosSection = styled.div`
  width: 95.6%;
  padding: 2%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Photo = styled.div`
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  border-radius: 10px;
  border: 3px solid ${(props) => props.theme.bgColor};
`;

const SButton = styled(Button)`
  margin-top: 30px;
`;
//#endregion

//#region GraphQL
const SEE_COFFEE_SHOP_QUERY = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      latitude
      longitude
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

const EDIT_COFFEE_SHOP_MUTATION = gql`
  mutation editCoffeeShop(
    $id: Int!
    $name: String
    $latitude: String
    $longitude: String
    $photos: [Upload]
    $category: [String]
  ) {
    editCoffeeShop(
      id: $id
      name: $name
      latitude: $latitude
      longitude: $longitude
      photos: $photos
      category: $category
    ) {
      ok
      error
    }
  }
`;
//#endregion

const initType = {
  name: "",
  latitude: "111",
  longitude: "222",
};

function EditShop() {
  const { id } = useParams();
  const [formValues, setFormValues] = useState(initType);
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [category, setCategories] = useState([]);

  const { data: coffeeShopData } = useQuery(SEE_COFFEE_SHOP_QUERY, {
    variables: {
      id: parseInt(id),
    },
    onCompleted: (data) => {
      setFormValues({
        ...formValues,
        name: data.seeCoffeeShop.name,
      });

      const compiledCategories = data.seeCoffeeShop.categories.map(
        (value) => value.name
      );

      const previewImage = data.seeCoffeeShop.photos.map((image) => {
        return {
          url: image.url,
        };
      });

      setCategories(compiledCategories);
      setPhotoUrls(previewImage);
    },
  });

  useEffect(() => {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onload = () => {
        setPhotoUrls((urls) => [
          ...urls,
          { url: reader.result, id: photo.lastModified },
        ]);
      };
    }
  }, [photos]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const addCategories = (event) => {
    if (
      event.key === "Enter" &&
      event.target.value !== "" &&
      !category.includes(event.target.value)
    ) {
      setCategories([...category, event.target.value]);
      event.target.value = "";
    } else if (event.key === "Backspace" && event.target.value === "") {
      setCategories(category.filter((_, index) => index < category.length - 1));
    }
  };

  const removeCategories = (index) => {
    console.log("index: ", index);
    setCategories([
      ...category.filter((category) => category.indexOf(category) !== index),
    ]);
  };

  const addPhotos = (event) => {
    setPhotoUrls([]);
    setPhotoError(null);
    if (
      photos.length >= 10 ||
      event.target.files.length + photos.length >= 10
    ) {
      alert("사진은 10개를 넘을 수 없습니다.");
    } else {
      setPhotos(event.target.files);
    }
  };

  const preventDefault = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
    }
  };

  const onSubmitValid = (event) => {
    event.preventDefault();

    const { name, longitude, latitude } = formValues;

    editCoffeeShop({
      variables: {
        id: parseInt(id),
        name: name,
        latitude: latitude,
        longitude: longitude,
        photos: photos,
        category: category,
      },
    });
  };

  const onCompleted = (data) => {
    const {
      editCoffeeShop: { ok, error },
    } = data;
    if (!ok) {
      alert(error);
    } else {
      window.location.replace(`/shop/${coffeeShopData?.seeCoffeeShop?.id}`);
    }
  };

  const [editCoffeeShop, { loading }] = useMutation(EDIT_COFFEE_SHOP_MUTATION, {
    onCompleted,
  });

  return (
    <Layout>
      <Title>카페 수정하기</Title>
      <Form onSubmit={onSubmitValid} onKeyDown={(e) => preventDefault(e)}>
        <Input
          maxLength={50}
          onChange={handleChange}
          name="name"
          type="text"
          value={formValues.name}
          placeholder="카페이름"
        />
        <ObjectContainer className="categories">
          <CategoryInput
            type="text"
            onKeyUp={(event) => addCategories(event)}
            placeholder="카테고리를 입력해주세요."
          />
          <CategoryList>
            {category !== []
              ? category.map((category, index) => (
                  <Category key={index}>
                    <CategoryContent>{category}</CategoryContent>
                    <RemoveCategory onClick={() => removeCategories(index)}>
                      <FontAwesomeIcon icon={faXmark} size="1x" />
                    </RemoveCategory>
                  </Category>
                ))
              : null}
            {!category[0] ? <Subtext>예: 디저트 브런치</Subtext> : null}
          </CategoryList>
        </ObjectContainer>
        <ObjectContainer>
          <div>
            <FileInput
              id="images"
              onChange={addPhotos}
              type="file"
              multiple
              accept=".png, .jpg"
            />
            <FileInputLabel htmlFor="images">사진 업로드</FileInputLabel>
          </div>
          <PhotosSection>
            {!!photoUrls[0]
              ? photoUrls.map((url, index) => (
                  <Photo
                    key={index}
                    style={{ backgroundImage: `url(${url.url})` }}
                  />
                ))
              : null}
            {!photoUrls[0] ? <Subtext>미리보기</Subtext> : null}
          </PhotosSection>
        </ObjectContainer>
        <ErrorText>{photoError?.message}</ErrorText>
        <SButton
          type="submit"
          value={loading ? "Loading..." : "수정하기"}
          disabled={loading}
        />
      </Form>
    </Layout>
  );
}

export default EditShop;
