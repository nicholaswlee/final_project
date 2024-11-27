import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header/Header";
import BodyContainer from "./components/bodyContainer/BodyContainer";
import { UserProvider } from "./contexts/UserContext";

export default function Home() {
  return (
    <UserProvider>
    <div className="page">
      <Header/>
      <BodyContainer/>
    </div>
    </UserProvider>
  );
}
