import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-white">
      <Container className="text-center">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="font-display text-ink mt-8 text-8xl font-black">404</p>
        <h1 className="font-ui text-ink mt-4 text-lg tracking-wide uppercase">
          Part Not Found
        </h1>
        <p className="text-steel-dark mx-auto mt-4 max-w-sm text-sm">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved, or the
          part number needs a closer look.
        </p>
        <Button href="/" className="mt-8 inline-flex">
          Back to Home
        </Button>
      </Container>
    </section>
  );
}
