import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const lightTheme = {
  accent: "#f5cd79",
  bgColor: "#FAFAFA",
  inputColor: "#f5f6fa",
  fontColor: "rgb(38, 38, 38)",
  borderColor: "rgb(219, 219, 219)",
};

export const darkTheme = {
  accent: "#f5cd79",
  bgColor: "#2f3640",
  inputColor: "#353b48",
  fontColor: "#f5f6fa",
  borderColor: "rgb(219, 219, 219)",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input {
      all:unset;
    }
    * {
      box-sizing:border-box;
      font-family: 'Spoqa Han Sans Neo', 'sans-serif';
    }
    body {
        background-color:${(props) => props.theme.bgColor};
        font-size:14px;
        font-family:'Open Sans', sans-serif;
        color:${(props) => props.theme.fontColor};
    }
    a {
      text-decoration: none;
    }
`;
