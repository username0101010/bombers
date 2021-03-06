import React from "react" ;

import Navbar from "../../components/Navbar";
import RatingList from "../../components/Rating/RatingList";
import RatingBanner from "../../components/Rating/RatingBanner";
import styles from "./rating-page.module.scss";

const RatingPage = () => {
    return (
        <div className={styles.page}>
            <Navbar />
            <RatingBanner />
            <RatingList />
        </div>
    );
};

export default RatingPage;
