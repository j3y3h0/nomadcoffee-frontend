import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useLocation } from "react-router-dom";
import { logUserIn } from "../apollo";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import routes from "../routes";

const Notification = styled.div`
  color: #2ecc71;
`;

const Logo = styled.div`
  cursor: pointer;
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

function Login() {
  const location = useLocation();
  const state = location.state || null;
  const history = useHistory();

  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setError] = useState({
    username: "",
    password: "",
    result: "",
  });

  //입력 이벤트
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  //로그인 제출
  const onSubmit = (event) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    //에러메시지 초기화
    setError({
      username: "",
      password: "",
      result: "",
    });

    //로그인 useQuery 실행
    login({
      variables: {
        username: formValue.username,
        password: formValue.password,
      },
    });
  };

  //로그인 결과
  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;

    if (!ok) {
      if (error.includes("아이디")) {
        setError({ ...errorMessage, username: error });
      } else if (error.includes("비밀번호")) {
        setError({ ...errorMessage, password: error });
      } else {
        setError({ ...errorMessage, result: error });
      }
    }

    if (token) {
      logUserIn(token);
    }
  };

  //로그인 Mutation
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });

  const goToHome = () => {
    history.push("/");
  };

  return (
    <AuthLayout>
      <PageTitle title="로그인" />
      <FormBox>
        <Logo onClick={goToHome}>
          <FontAwesomeIcon icon={faMugHot} size="3x" />
        </Logo>
        {state?.message && <Notification>{state.message}</Notification>}
        <form onSubmit={onSubmit}>
          <Input
            onChange={handleChange}
            type="text"
            name="username"
            placeholder="사용자 이름"
            hasError={errorMessage.username}
            maxLength={15}
            required
          />
          <FormError message={errorMessage.username} />
          <Input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="비밀번호"
            hasError={errorMessage.password}
            required
          />
          <FormError message={errorMessage.password} />
          <Button
            type="submit"
            value={loading ? "로딩 중..." : "로그인"}
            disabled={loading}
          />
          <FormError message={errorMessage.result} />
        </form>
      </FormBox>
      <BottomBox
        text="아이디가 없으신가요?"
        linkText="회원가입"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}

export default Login;
