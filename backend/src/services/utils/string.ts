export function capitalizeFirstLetter(string: string): string {
    if (string.length === 0) return string; // Retourne la chaîne vide si la chaîne est vide.
  
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  