fetch('/api/sendMailForgotPasword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Pas de corps nécessaire ici, mais vous pouvez en ajouter un si votre API l'exige
  }).then(response => {
    // Gérer la réponse ici
  }).catch(error => {
    // Gérer l'erreur ici
  });
  