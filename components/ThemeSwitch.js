import { useEffect, useState } from "react";
import React from "react";

const ThemeSwitch = ({toggle, setToogle}) => {

    // const [toggle, setToogle] = useState(true);

    useEffect(() => {

        if ( (localStorage.getItem('theme') === 'dark')) {
            document.documentElement.classList.add('dark');
            setToogle(false);
        }
        else if ((localStorage.getItem('theme') === 'light')) {

            document.documentElement.classList.remove('dark');
            setToogle(true);
        }
        else if ((localStorage.getItem('theme') == undefined)) {
            console.log("No theme set.. making it dark");
            document.documentElement.classList.add('dark');
            setToogle(false);
            localStorage.setItem('theme', 'dark');

        }
    }, [])

    return (
        <React.Fragment>
            <span className={`cols-start-4 col-end-5 self-center justify-self-center`}>
                <label
                    className="container"

                >
                    <input
                        type="checkbox"
                        checked={toggle}
                        onChange={() => {
                            if ((localStorage.getItem('theme') === 'dark')) {
                                console.log("It's dark.. switiching to light")
                                localStorage.setItem('theme', 'light');
                                document.documentElement.classList.remove('dark')
                                setToogle(true);
                            }
                            else if ((localStorage.getItem('theme') === 'light')) {
                                console.log("It's light.. switiching to dark")
                                localStorage.setItem('theme', 'dark')
                                document.documentElement.classList.add('dark')
                                setToogle(false);
                            }
                            else if ((localStorage.getItem('theme') == undefined)) {
                                console.log("No theme set.. making it dark")
                                localStorage.setItem('theme', 'dark')
                                document.documentElement.classList.add('dark');
                                setToogle(false)
                            }
                        }}
                    />
                    <div />
                </label>
            </span>
        </React.Fragment>
    )
}

export default ThemeSwitch;