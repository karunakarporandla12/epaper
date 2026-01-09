import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";
import Header from "./Header";
import Footer from "./Footer";
import SocialShareButtons from "../components/share/SocialShareButtons";


export default function Home1() {
  return (
    <div className="home-page">
       <Header/>
    

<SocialShareButtons/>
      <Footer/>
    </div>
  );
}
