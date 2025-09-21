import { SearchIcon } from "lucide-react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { CharactersGrid } from "@/features/characters/components/characters-grid";

export default function Home() {
  return (
    <Container>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-center tracking-tight">
            AI CLASH
          </h1>
          <p className="text-muted-foreground text-center">
            Explore our diverse collection of AI personalities
          </p>
        </div>

        <div className="relative">
          <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for an AI character"
            className="ps-9 h-12"
          />
        </div>

        <CharactersGrid />
      </div>
    </Container>
  );
}
