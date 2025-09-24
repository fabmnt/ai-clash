import { SearchIcon } from "lucide-react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { CharactersGrid } from "@/features/characters/components/characters-grid";
import { CreateCharacterDialog } from "@/features/characters/components/create-character-dialog";

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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for an AI character"
              className="ps-9 h-12"
            />
          </div>
          <div className="flex justify-end">
            <CreateCharacterDialog />
          </div>
        </div>

        <CharactersGrid />
      </div>
    </Container>
  );
}
