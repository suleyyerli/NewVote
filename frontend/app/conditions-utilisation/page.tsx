"use client";

export default function ConditionsUtilisation() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Conditions d&apos;Utilisation</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Acceptation des conditions
        </h2>
        <p>
          En accédant et en utilisant NewVote, vous acceptez d&apos;être lié par
          les présentes conditions d&apos;utilisation. Si vous n&apos;acceptez
          pas ces conditions, veuillez ne pas utiliser notre service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Description du service</h2>
        <p>
          NewVote est un réseau social permettant aux utilisateurs de créer et
          de participer à des votes, de partager des opinions et
          d&apos;interagir avec d&apos;autres utilisateurs.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Inscription et compte utilisateur
        </h2>
        <p>Pour utiliser notre service, vous devez :</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Avoir au moins 13 ans</li>
          <li>Fournir des informations exactes et à jour</li>
          <li>Maintenir la confidentialité de votre compte</li>
          <li>Ne pas partager vos identifiants de connexion</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Règles de conduite</h2>
        <p>Vous vous engagez à :</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Respecter les autres utilisateurs</li>
          <li>Ne pas publier de contenu illégal ou offensant</li>
          <li>Ne pas harceler ou intimider d&apos;autres utilisateurs</li>
          <li>Ne pas utiliser le service à des fins malveillantes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Propriété intellectuelle
        </h2>
        <p>
          Le contenu que vous publiez reste votre propriété. Cependant, en
          publiant sur NewVote, vous nous accordez une licence mondiale pour
          utiliser, reproduire et distribuer ce contenu.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Modification des conditions
        </h2>
        <p>
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les modifications prendront effet dès leur publication sur le site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Résiliation</h2>
        <p>
          Nous nous réservons le droit de suspendre ou de résilier votre compte
          en cas de violation de ces conditions d&apos;utilisation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Pour toute question concernant ces conditions d&apos;utilisation,
          veuillez nous contacter à :
        </p>
        <p>Email : devBTS@newvote.com</p>
      </section>
    </div>
  );
}
