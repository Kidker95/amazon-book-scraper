import { Navigate, Route, Routes } from "react-router-dom";
import { List } from "../../DataArea/List/List";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../Page404/Page404";
import "./Routing.css";

export function Routing(): JSX.Element {

    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />

                <Route path="/home" element={<Home />} />

                <Route path="/search" element={<List />} />
                
                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}
