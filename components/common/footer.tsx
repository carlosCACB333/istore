import { Link } from "@nextui-org/link";

export const Footer = () => {
  return (
    <footer className="text-center p-2">
      <p className="text-tiny">
        Desarrollado con <span>❤️</span> por{" "}
        <Link href="https://carloscb.com">Carlos</Link>
      </p>
    </footer>
  );
};
