import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Redirect to the default locale (Serbian)
  redirect('/rs');
}
