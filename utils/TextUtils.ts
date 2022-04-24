export function formatLocationName(location: string) {
  const tokens: string[] = location.split("-");
  const capitalizedTokens: string[] = [];
  for (let token of tokens) {
    const lowercaseToken = token.toLowerCase();
    const uppercaseFirstLetter = lowercaseToken.charAt(0).toUpperCase();
    const capitalizedToken = uppercaseFirstLetter + lowercaseToken.slice(1, lowercaseToken.length);
    capitalizedTokens.push(capitalizedToken);
  }
  return(capitalizedTokens.join(" "));
}