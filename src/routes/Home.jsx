import { isLoggedInVar } from "../apollo";

function Home({ setIsLoggedIn }) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => isLoggedInVar(false)}>로그아웃</button>
    </div>
  );
}
export default Home;
