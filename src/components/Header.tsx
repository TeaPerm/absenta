import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";
import { NavLinks } from "@/components/ui/navLink";
import { useAuthStore } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

function MenuIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronUpIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavLink(
  props: Omit<React.ComponentPropsWithoutRef<"a">, "className">
) {
  return (
    <a className="block text-base/7 tracking-tight text-gray-700" {...props} />
  );
}

export function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useUser();

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <a href="/" aria-label="Home">
              <Logo />
            </a>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <PopoverButton
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 focus:not-data-focus:outline-hidden active:stroke-gray-900"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
                      )
                    }
                  </PopoverButton>
                  <AnimatePresence initial={false}>
                    {open && (
                      <>
                        <PopoverBackdrop
                          static
                          as={motion.div}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur-sm"
                        />
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -32 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            y: -32,
                            transition: { duration: 0.2 },
                          }}
                          className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pt-32 pb-6 shadow-2xl shadow-gray-900/20"
                        >
                          <div className="space-y-4">
                            <MobileNavLink href="/#steps">
                              Lépések
                            </MobileNavLink>
                            <MobileNavLink href="/#features">
                              Features
                            </MobileNavLink>
                            <MobileNavLink href="/#pricing">
                              Pricing
                            </MobileNavLink>
                            <MobileNavLink href="/#faqs">FAQs</MobileNavLink>
                          </div>
                          <div className="mt-8 flex flex-col gap-4">
                            {isAuthenticated ? (
                              <Link to={`${user?.university[0]}`}>
                                <Button variant="outline" className="w-full bg-theme hover:bg-theme/80">Vezérlőpult</Button>
                              </Link>
                            ) : (
                              <>
                                <Link to="/register">
                                  <Button variant="outline" className="w-full">Regisztráció</Button>
                                </Link>
                                <Link to="/login">
                                  <Button className="w-full">Belépés</Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Popover>
            <AuthenticatedLayout />
          </div>
        </Container>
      </nav>
    </header>
  );
}

function AuthenticatedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useUser();

  if (isAuthenticated) {
    return (
      <div className="max-lg:hidden">
        <Link to={`${user?.university[0]}`}>
          <Button variant="outline" className="bg-theme text-white hover:text-white hover:bg-theme/80">Vezérlőpult</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 max-lg:hidden">
      <Link to="/register">
        <Button variant="outline">Regisztráció</Button>
      </Link>{" "}
      <Link to="/login">
        <Button className="bg-theme hover:bg-theme/80">Belépés</Button>
      </Link>
    </div>
  );
}
