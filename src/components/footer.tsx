import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Container } from "./ui/container";
import Logo from "@/components/ui/logo";
import { NavLinks } from "@/components/ui/navLink";
interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Container className={cn("text-black", className)}>
      <div className="container mx-auto py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="flex justify-center space-x-8 mb-16 gap-10">
            <NavLinks />
        </div>

        <Separator className="mb-8 bg-gray-700" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm">
              © {currentYear} 
              <span className="text-gray-700">{" "}Absent</span>
              <span className="text-gray-700/50">a</span>
            </p>
          </div>

        <div>
            <p className="text-sm">
                Készítette: Le Thien Nam
            </p>
        </div>
        </div>
      </div>
    </Container>
  );
}
