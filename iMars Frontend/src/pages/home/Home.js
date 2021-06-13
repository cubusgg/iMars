import Menu from "../../components/main/menu/Menu";
import Feed from "../../components/main/feed/Feed";
import RightBar from "../../components/main/rightBar/RightBar";
import Navigation from "../../components/main/navigation/Navigation";
import './home.css';

const Home = () => {

    return (
        <>
            <Navigation />
            <div className="homeContainer">
                <Menu />
                <Feed />
                <RightBar />
            </div>
        </>
    );
};

export default Home;
