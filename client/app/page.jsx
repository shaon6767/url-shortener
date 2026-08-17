import ShortenForm from "../components/ShortenForm";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Shorten a URL</h1>
      <ShortenForm />
    </div>
  );
}
