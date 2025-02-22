import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard, faDesktop } from "@fortawesome/free-solid-svg-icons";

import { Link, useLocation } from "react-router-dom";

interface Props {
  closeNavBar: () => void;
}

const NavbarTabs: React.FC<Props> = ({ closeNavBar }) => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState("");

  const Tabs = [
    {
      label: "Home",
      link: "/home",
      logo: <FontAwesomeIcon icon={faDesktop} />,
      name: "home",
    },
    {
      label: "Stats",
      link: "/analyses/list",
      logo: <FontAwesomeIcon icon={faDashboard} />,
      name: "analyses",
    },
  ];

  useEffect(() => {
    const list = location.pathname.split("/");
    setCurrentLocation(list[1].toLocaleLowerCase());
  }, [location, currentLocation]);

  return (
    <>
      {Tabs.map((navItem) => {
        return (
          <Link
            id={navItem.name}
            data-cy={`header-${navItem.name}`}
            className={
              "nav-item a no-select no-hover-color" +
              (currentLocation === navItem.name
                ? " selected-nav"
                : " unselected-nav")
            }
            to={navItem.link}
            key={navItem.name}
            onClick={closeNavBar}
          >
            <span>{navItem.logo} </span>
            <span
              className={
                currentLocation === navItem.name
                  ? "selected-nav-item"
                  : "unselected-nav-item"
              }
            >
              {navItem.label}
            </span>
          </Link>
        );
      })}
    </>
  );
};

export default NavbarTabs;
