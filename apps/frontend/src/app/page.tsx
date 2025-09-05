// Deze pagina bestaat om te voldoen aan de Next.js routeringsvereisten.
// Al het verkeer wordt omgeleid door middleware:
// - Geverifieerde gebruikers → /dashboard
// - Niet-geverifieerde gebruikers → /login

export default function RootPage() {
  // Deze component zou nooit moeten renderen vanwege middleware omleidingen
  return null;
}
