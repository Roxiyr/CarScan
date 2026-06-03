export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">CarLens</h1>
          <a
            href="#about"
            className="text-gray-600 hover:text-primary transition"
          >
            About
          </a>
        </div>
      </div>
    </header>
  );
};
