import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
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
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};

  &:focus {
    border-color: rgb(38, 38, 38);
  }
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
  background-color: ${(props) => props.theme.deepColor};
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
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  width: 100%;
  height: 40px;
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
  border: 1px solid ${(props) => props.theme.deepColor};
`;

const SButton = styled(Button)`
  margin-top: 30px;
`;
//#endregion

//#region GraphQL
const CREATE_COFFEE_SHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name: String!
    $latitude: String!
    $longitude: String!
    $photos: [Upload]
    $category: [String]!
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      photos: $photos
      category: $category
    ) {
      ok
      id
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

function AddCoffeeShop() {
  const [formValues, setFormValues] = useState(initType);
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setError] = useState({
    ...initType,
    result: "",
    photos: "",
  });

  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [category, setCategories] = useState([]);

  useEffect(() => {
    setPhotoUrls([]);
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
    setCategories([
      ...category.filter((category) => category.indexOf(category) !== index),
    ]);
  };

  const addPhotos = (event) => {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmitValid = (event) => {
    event.preventDefault();

    if (!photos[0]) {
      alert("사진을 최소 하나 업로드해주세요");
      return;
    }

    const { name, longitude, latitude } = formValues;

    createCoffeeShop({
      variables: {
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
      createCoffeeShop: { ok, error, id },
    } = data;

    if (!ok) {
      alert(error);
      console.log("error: ", error);
    } else if (id) {
      window.location.replace(`/shop/${id}`);
    }
  };

  const [createCoffeeShop, { loading }] = useMutation(
    CREATE_COFFEE_SHOP_MUTATION,
    {
      onCompleted,
    }
  );

  return (
    <Layout>
      <Title>카페 생성하기</Title>
      <Form onSubmit={onSubmitValid} onKeyDown={(e) => preventDefault(e)}>
        <Input
          maxLength={50}
          onChange={handleChange}
          name="name"
          type="text"
          placeholder="카페이름"
          required
          hasError={errorMessage.name}
        />
        <ObjectContainer>
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
            {!!photos[0]
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
        <ErrorText>
          {photoError?.message ? photoError?.message : errorMessage.photos}
        </ErrorText>
        <SButton
          type="submit"
          value={loading ? "Loading..." : "생성하기"}
          disabled={loading}
        />
        <ErrorText>{errorMessage.result}</ErrorText>
      </Form>
    </Layout>
  );
}

export default AddCoffeeShop;
