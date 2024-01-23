export default function handler(req, res) {
  // Ajout d'un console.log pour enregistrer une information dans les logs
  console.log("La méthode MonAPI a été appelée")

  // Ici, vous pouvez mettre en place votre logique d'API

  // Envoyer une réponse
  res.status(200).json({ message: 'API appelée avec succès' })
}
