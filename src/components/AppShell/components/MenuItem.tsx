import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItemProps {
  text: string;
  to: string;
  selected?: boolean;
  mobile?: boolean;
  setMobileMenu?: (show: boolean) => void
}

export function MenuItem({
  text,
  to,
  selected = false,
  mobile = false,
    setMobileMenu
}: MenuItemProps) {
  const desktopSelectedClassName =
    'px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700';
  const mobileSelectedClassName =
    'block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700';

  const desktopNotSelectedClassName =
    'px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700';
  const mobileNotSelectedClassName =
    'block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700';

  let linkClass: string;
  if (mobile) {
    linkClass = selected ? mobileSelectedClassName : mobileNotSelectedClassName;
  } else {
    linkClass = selected
      ? desktopSelectedClassName
      : desktopNotSelectedClassName;
  }

  return (
    <NavLink to={to}
             className={linkClass} onClick={() => setMobileMenu ? setMobileMenu(false) : null}>
      {text}
    </NavLink>
  );
}
