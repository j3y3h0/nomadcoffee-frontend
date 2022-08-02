import { gql, useMutation } from "@apollo/client";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SingUp() {
  const history = useHistory();

  const onCompleted = (data) => {
    const { username, password } = getValues();

    const {
      createAccount: { ok },
    } = data;
    if (!ok) {
      return;
    }

    history.push(routes.home, {
      message: "회원가입이 완료되었습니다. 로그인을 해주세요.",
      username,
      password,
    });
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }

    createAccount({
      variables: {
        ...data,
      },
    });
  };

  console.log(watch());

  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faMugHot} size="3x" />
          <Subtitle>
            노마드 커피를 이용하기 위해 회원가입이 필요합니다.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("name", {
              required: "이름이 입력되지 않았습니다.",
            })}
            type="text"
            placeholder="이름"
          />
          <Input
            {...register("email", {
              required: "이메일이 입력되지 않았습니다.",
              pattern: {
                message:
                  "한글, 특수문자를 제외한 영문 이메일 형식만 사용 가능합니다.",
                value:
                  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/gi,
              },
              maxLength: 30,
            })}
            name="email"
            type="text"
            maxLength={30}
            placeholder="E-Mail"
          />
          <Input
            {...register("username", {
              required: "아이디가 입력되지 않았습니다.",
              pattern: {
                message:
                  "한글, 특수문자를 제외한 1~15자 이내 영문만 사용 가능합니다.",
                value: /^[a-z0-9]{1,15}$/g,
              },
            })}
            name="username"
            type="text"
            placeholder="아이디"
          />
          <Input
            {...register("password", {
              required: "비밀번호가 입력되지 않았습니다.",
            })}
            type="password"
            hasError={Boolean(errors?.password?.message)}
            placeholder="비밀번호"
          />
          <Button
            type="submit"
            value={loading ? "로딩중" : "회원가입"}
            disabled={!isValid || loading}
          />
        </form>
      </FormBox>
      <BottomBox
        text="이미 아이디가 있나요?"
        linkText="로그인"
        link={routes.home}
      />
    </AuthLayout>
  );
}

export default SingUp;
