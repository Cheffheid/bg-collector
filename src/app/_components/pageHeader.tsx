export function PageHeader(props: {
  pageTitle: string;
  pageDescription: string;
}) {
  return (
    <div className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="w-full text-2xl font-bold">{props.pageTitle}</h1>
        <p>{props.pageDescription}</p>
      </div>
    </div>
  );
}
