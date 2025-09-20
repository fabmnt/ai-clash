import { AtSignIcon, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Character } from "../schemas/character-schema";

type CharacterCardProps = {
  character: Character;
};

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Image
            src={character.avatarUrl}
            alt={character.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <CardTitle className="text-lg">{character.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{character.description}</p>
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Model: {character.model}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon">
            <AtSignIcon />
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircleIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
