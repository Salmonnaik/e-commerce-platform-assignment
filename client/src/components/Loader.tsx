export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}

export function SmallLoader() {
  return (
    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
  );
}
