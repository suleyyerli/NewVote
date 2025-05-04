"use client";

export default function PolitiqueConfidentialite() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p>
          NewVote s'engage à protéger la vie privée de ses utilisateurs. Cette
          politique de confidentialité explique comment nous collectons,
          utilisons et protégeons vos données personnelles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Collecte des données</h2>
        <p>Nous collectons les informations suivantes :</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Informations d&apos;identification (nom, prénom, email)</li>
          <li>Données de navigation (cookies)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Nous n&apos;utilisons pas vos données personnelles.
        </h2>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Protection des données</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité appropriées pour
          protéger vos données contre tout accès non autorisé, modification,
          divulgation ou destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Droit d&apos;accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l&apos;effacement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d&apos;opposition</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité,
          veuillez nous contacter à :
        </p>
        <p>Email : devBTS@newvote.com</p>
      </section>
    </div>
  );
}
