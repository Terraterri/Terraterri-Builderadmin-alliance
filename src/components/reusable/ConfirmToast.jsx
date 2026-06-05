import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const ConfirmToast = ({ message, resolve, closeToast }) => (
    <div className="px-2 py-1 text-center">
        <p className="fw-bold mb-2 fs-5">{message}?</p>
        <div className="d-flex justify-content-center gap-2">
            <button
                className="btn btn-success btn-sm fw-bold"
                onClick={() => {
                    resolve(true);
                    closeToast();
                }}
            >
                Yes
            </button>
            <button
                className="btn btn-danger btn-sm fw-bold"
                onClick={() => {
                    resolve(false);
                    closeToast();
                }}
            >
                No
            </button>
        </div>
    </div>
);

const confirmAction = (message) => {
    return new Promise((resolve) => {
        toast(({ closeToast }) => <ConfirmToast message={message} resolve={resolve} closeToast={closeToast} />, {
            autoClose: false,
            closeOnClick: false,
        });
    });
};

export default confirmAction;
