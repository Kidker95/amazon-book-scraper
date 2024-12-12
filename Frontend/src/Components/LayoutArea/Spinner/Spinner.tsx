import ReactLoading from "react-loading";
import "./Spinner.css";

export function Spinner(): JSX.Element {
    return (
        <div className="Spinner">
            <ReactLoading type="balls" color="#3b82f6" height={150} width={200} />
        </div>
    );
}
