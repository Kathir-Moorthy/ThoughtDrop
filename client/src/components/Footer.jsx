const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white py-6 mt-10">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-2">© {new Date().getFullYear()} ThoughtDrop - Your Personal Journal App</p>
        <p className="text-sm opacity-80">
          Capture your thoughts, one drop at a time.
        </p>
      </div>
    </footer>
  );
};

export default Footer;