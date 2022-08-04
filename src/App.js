import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { client, darkModeVar, isLoggedInVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import { HelmetProvider } from "react-helmet-async";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NotFound from "./routes/NotFound";
import SignUp from "./routes/SignUp";
import routes from "./routes";
import Layout from "./components/Layout";
import AddCoffeeShop from "./routes/AddShop";
import CoffeeShop from "./routes/CoffeeShop";
import EditShop from "./routes/EditShop";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Switch>
              {!isLoggedIn && (
                <Route path={routes.signUp} exact>
                  <SignUp />
                </Route>
              )}
              {!isLoggedIn && (
                <Route path={routes.login} exact>
                  <Login />
                </Route>
              )}
              {isLoggedIn && (
                <Route path={routes.add} exact>
                  <Layout>
                    <AddCoffeeShop />
                  </Layout>
                </Route>
              )}
              <Route path={`${routes.shop}/:id`} exact>
                <Layout>
                  <CoffeeShop />
                </Layout>
              </Route>
              {isLoggedIn && (
                <Route path={`${routes.shop}/:id/edit`} exact>
                  <Layout>
                    <EditShop />
                  </Layout>
                </Route>
              )}
              <Route path={routes.home} exact>
                <Layout>
                  <Home />
                </Layout>
              </Route>
              <NotFound />
            </Switch>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
