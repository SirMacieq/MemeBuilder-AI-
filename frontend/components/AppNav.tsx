import Link from "next/link";

const AppNav = () => {
  return (
    <nav>
      <Link href="profile/">Profile</Link>
      <Link href="login/">Login</Link>
      <Link href="register/">Register</Link>
    </nav>
  );
};

export default AppNav;
