import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

const TOKEN = "TOKEN";
const DARK_MODE = "DARK_MODE";
const SERVER_URL = "https://nomad-coffee-j3y3h0.herokuapp.com/graphql";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const logUserIn = (token) => {
  localStorage.setItem(TOKEN, token);
  window.location.replace("/");
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  window.location.replace("/");
};

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN),
    },
  };
});

const uploadLink = createUploadLink({
  uri: SERVER_URL,
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});
