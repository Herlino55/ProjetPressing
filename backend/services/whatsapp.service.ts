/**
 * Génère un lien WhatsApp prérempli pour envoyer un message au client
 * via le numéro du gérant (non API officielle)
 * @param to - numéro du client (ex: 6XXXXXXXX ou 2376XXXXXXXX)
 * @param message - contenu du message
 * @param senderName - nom du gérant (facultatif)
 * @returns string - URL WhatsApp prête à être ouverte dans le navigateur
 */
export const generateWhatsAppLink = (
  to: string,
  message: string,
  senderName?: string
): string => {
  // Nettoyer le numéro (retirer tout sauf les chiffres)
  let cleanNumber = to.replace(/\D/g, "");

  // Ajouter le code pays si manquant
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "237" + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith("237")) {
    cleanNumber = "237" + cleanNumber;
  }

  // Ajouter le nom du gérant dans le message si disponible
  const finalMessage = senderName
    ? `Message de la part du pressing ${senderName} : ${message}`
    : message;

  // Générer l'URL WhatsApp
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMessage)}`;

  return whatsappUrl;
};
