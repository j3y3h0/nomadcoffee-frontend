import { useReactiveVar } from "@apollo/client";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { faHome, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { isLoggedInVar } from "../apollo";
import { logUserOut } from "../apollo";
import useUser from "../hooks/useUser";
import routes from "../routes";
import Avatar from "./Avatar";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../apollo";

const SHeader = styled.header`
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.bgColor};
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 930px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.span`
  margin-left: 15px;
  cursor: pointer;
`;

const Button = styled.span`
  background-color: ${(props) => props.theme.accent};
  border-radius: 4px;
  padding: 4px 15px;
  color: "#f5f6fa";
  font-weight: 600;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const DarkModeBtn = styled.span`
  cursor: pointer;
`;

function Header() {
  const history = useHistory();
  const darkMode = useReactiveVar(darkModeVar);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useUser();

  const goTo = (url) => {
    history.push(url);
  };

  return (
    <SHeader>
      <Wrapper>
        <div>
          <Icon>
            <FontAwesomeIcon icon={faMugHot} size="2x" />
          </Icon>
          <Icon>
            <DarkModeBtn onClick={darkMode ? disableDarkMode : enableDarkMode}>
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="2x" />
            </DarkModeBtn>
          </Icon>
        </div>
        <div>
          {isLoggedIn ? (
            <IconsContainer>
              <Icon onClick={() => goTo("/")}>
                <FontAwesomeIcon icon={faHome} size="lg" />
              </Icon>
              <Icon>
                <Avatar url={data?.me?.avatarUrl} />
              </Icon>
              <Icon>
                <Link to="/add">
                  <Button>카페생성</Button>
                </Link>
              </Icon>
              <Icon>
                <Link to="#" onClick={logUserOut}>
                  <Button>로그아웃</Button>
                </Link>
              </Icon>
            </IconsContainer>
          ) : (
            <>
              <Icon>
                <Link to={routes.login}>
                  <Button>로그인</Button>
                </Link>
              </Icon>
              <Icon>
                <Link to={routes.signUp}>
                  <Button>회원가입</Button>
                </Link>
              </Icon>
            </>
          )}
        </div>
      </Wrapper>
    </SHeader>
  );
}
export default Header;
