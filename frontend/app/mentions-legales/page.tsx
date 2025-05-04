"use client";

export default function MentionsLegales() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mentions Légales</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
        <p>NewVote</p>
        <p>Réseau social depuis 2024</p>
        <p>Email : devBTS@newvote.com</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
        <p>Le site est hébergé par :</p>
        <p>Nom de l&apos;hébergeur</p>
        <p>Adresse de l&apos;hébergeur</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Propriété intellectuelle
        </h2>
        <p>
          Tous les éléments du site NewVote (textes, graphismes, logos, images,
          etc.) sont protégés par les lois relatives à la propriété
          intellectuelle.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Protection des données personnelles
        </h2>
        <p>
          Conformément à la loi &quot;Informatique et Libertés&quot; du 6
          janvier 1978 modifiée et au Règlement Général sur la Protection des
          Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de
          rectification, de suppression et de portabilité des données vous
          concernant.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
        <p>
          Le site utilise des cookies pour améliorer l&apos;expérience
          utilisateur. Pour plus d&apos;informations, consultez notre page
          dédiée à la gestion des cookies.
        </p>
      </section>
    </div>
  );
}
