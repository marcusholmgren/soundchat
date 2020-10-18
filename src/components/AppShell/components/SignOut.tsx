import React from "react";
import {auth} from "../../../firebase";
import {useNavigate} from "react-router-dom";

interface SignOutProps {
    setIsShowing: (show: boolean) => void
}

export function SignOut({setIsShowing}: SignOutProps) {
    const navigate = useNavigate();

    function click() {
        setIsShowing(false);
        auth
            .signOut()
            .then(function () {
                console.log("Sign-out successful.");
                navigate("/");
            })
            .catch(function (error: any) {
                console.error("An error happened.", error);
            });
    }

    return (
        <div onClick={click}>
            Sign out
        </div>
    )
}