import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { NavLink } from 'react-router-dom';
import { Transition } from '@headlessui/react';
import { MenuItem } from './components/MenuItem';
import { auth, provider, FirebaseContext, useAuth } from '../../firebase';
//const firebase = new Firebase();
import { SignOut } from './components/SignOut';
import { Signin } from '../../signin';

type AppShellProps = {};

export function AppShell({ children }: PropsWithChildren<AppShellProps>) {
  const user = useAuth();
  //const {user} = useContext(FirebaseContext);
  const [isShowing, setIsShowing] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    function handleEscape(event: { key: string }) {
      if (!isShowing) return;

      if (event.key === 'Escape') {
        setIsShowing(false);
      }
    }

    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [isShowing]);

  const desktopUserElement = user ? (
    <div>
      <button
        className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
        id="user-menu"
        aria-label="User menu"
        aria-haspopup="true"
        onClick={() => setIsShowing(!isShowing)}
      >
        <img
          className="h-8 w-8 rounded-full"
          src={user.photoURL ?? ''}
          alt={user.displayName ?? ''}
        />
      </button>
    </div>
  ) : (
    <div>
      <NavLink
        to="/signin"
        className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
      >
        Sign in
      </NavLink>
    </div>
  );

  const mobileUserElement = user ? (
    <div className="pt-4 pb-3 border-t border-gray-700">
      <div className="flex items-center px-5 space-x-3">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={user.photoURL ?? ''}
            alt={user.displayName ?? ''}
          />
        </div>
        <div className="space-y-1">
          <div className="text-base font-medium leading-none text-white">
            {user?.displayName}
          </div>
          <div className="text-sm font-medium leading-none text-gray-400">
            {user?.email}
          </div>
        </div>
      </div>
      <div
        className="mt-3 px-2 space-y-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
      >
        <a
          href="#"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          role="menuitem"
        >
          Your Profile
        </a>

        <a
          href="#"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          role="menuitem"
        >
          Settings
        </a>

        <NavLink
          to="/"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          role="menuitem"
        >
          <SignOut setIsShowing={setIsShowing} />
        </NavLink>
      </div>
    </div>
  ) : (
    <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
      <NavLink to="/signin" onClick={() => setMobileMenu(false)}>
        Sign in
      </NavLink>
    </div>
  );

  const desktopLoggedInElement = user ? (
    <div className="ml-10 flex items-baseline space-x-4">
      <MenuItem text="Select Artist" to="/artist" selected={true} />
      <MenuItem text="My Songs" to="/my-songs" />
      <MenuItem text="Add Tune" to="/add" />
    </div>
  ) : null;

  const mobileLoggedInElement = user ? (
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      <MenuItem
        text="Select Artist"
        to="/artist"
        mobile={true}
        setMobileMenu={setMobileMenu}
      />
      <MenuItem
        text="My Songs"
        to="/my-songs"
        mobile={true}
        setMobileMenu={setMobileMenu}
      />
      <MenuItem
        text="Add Tune"
        to="/add"
        mobile={true}
        setMobileMenu={setMobileMenu}
      />
    </div>
  ) : null;

  return (
    <div>
      <FirebaseContext.Provider value={{ user }}>
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <NavLink to="/" className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="/apple-touch-icon.png"
                    alt="Soundchat logo"
                  />
                </NavLink>
                <div className="hidden md:block">{desktopLoggedInElement}</div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
                    aria-label="Notifications"
                  >
                    <svg
                      className="h-6 w-6"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  {/* <!-- Profile dropdown --> */}
                  <div className="ml-3 relative">
                    {desktopUserElement}
                    {/*
              <!--
                Profile dropdown panel, show/hide based on dropdown state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
              */}
                    <Transition
                      show={isShowing}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      {(ref) => (
                        <div
                          ref={ref}
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                        >
                          <div className="py-1 rounded-md bg-white shadow-xs">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Your Profile
                            </a>

                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Settings
                            </a>

                            <NavLink
                              to="/"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <SignOut setIsShowing={setIsShowing} />
                            </NavLink>
                          </div>
                        </div>
                      )}
                    </Transition>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* <!-- Mobile menu button --> */}
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
                  <svg
                    className={'h-6 w-6 '.concat(
                      mobileMenu ? 'hidden' : 'block',
                    )}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
                  <svg
                    className={'h-6 w-6 '.concat(
                      mobileMenu ? 'block' : 'hidden',
                    )}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/*
    <!--
      Mobile menu, toggle classNamees based on menu state.

      Open: "block", closed: "hidden"
    -->
    */}
          <div className={'md:hidden '.concat(mobileMenu ? 'block' : 'hidden')}>
            {mobileLoggedInElement}
            {mobileUserElement}
          </div>
        </nav>

        {/*        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-lg leading-6 font-semibold text-gray-900">
              Soundchat
            </h1>
          </div>
        </header>*/}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* <!-- Replace with your content --> */}
            {children}
            {/*  <!-- /End replace --> */}
          </div>
        </main>
      </FirebaseContext.Provider>
      <Footer />
    </div>
  );
}



/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/marcusholmgren',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/marcusholmgren',
    icon: (props) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">&copy; 2021 Marcus Holmgren, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
