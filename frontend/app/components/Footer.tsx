"use client";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-100 text-base-content border-t">
      <div>
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          className="inline-block fill-primary"
        >
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"></path>
        </svg>
        <p className="font-bold text-primary">
          NewVote <br />
          Réseau social depuis 2024
        </p>
        <p>Copyright © 2024 - Tous droits réservés</p>
      </div>
      <div className="grid grid-flow-col gap-4">
        <a href="/mentions-legales" className="link link-hover">
          Mentions légales
        </a>
        <a href="/politique-confidentialite" className="link link-hover">
          Politique de confidentialité
        </a>
        <a href="/cookies" className="link link-hover">
          Gestion des cookies
        </a>
        <a href="/conditions-utilisation" className="link link-hover">
          Conditions d&apos;utilisation
        </a>
      </div>
    </footer>
  );
}
