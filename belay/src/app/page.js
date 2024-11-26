import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/header/Header";
import BodyContainer from "./components/bodyContainer/BodyContainer";

export default function Home() {
  return (
    <div class="page">
      <Header/>
      <BodyContainer/>
    </div>
  );
}
