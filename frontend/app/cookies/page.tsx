"use client";

export default function Cookies() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Cookies</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Qu&apos;est-ce qu&apos;un cookie ?
        </h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal lors de
          la visite d&apos;un site internet. Il permet au site de mémoriser des
          informations sur votre visite.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Les cookies que nous utilisons
        </h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Cookies essentiels</h3>
          <p>
            Ces cookies sont nécessaires au fonctionnement du site. Ils
            permettent d&apos;utiliser les fonctionnalités principales du site.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Comment gérer les cookies ?
        </h2>
        <p>
          Vous pouvez à tout moment choisir de désactiver ces cookies. Votre
          navigateur peut également être paramétré pour vous signaler les
          cookies qui sont déposés dans votre terminal et vous demander de les
          accepter ou non.
        </p>
        <p className="mt-4">
          Pour plus d&apos;informations sur la gestion des cookies selon votre
          navigateur :
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies"
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edge
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consentement</h2>
        <p>
          En continuant à naviguer sur notre site, vous acceptez
          l&apos;utilisation des cookies. Vous pouvez à tout moment modifier vos
          préférences via les paramètres de votre navigateur.
        </p>
      </section>
    </div>
  );
}
