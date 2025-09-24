"use client";

import { useMutation } from "convex/react";
import { PencilIcon } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { api } from "#/convex/_generated/api";
import type { Doc } from "#/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  name: string;
  uniqueName: string;
  avatarUrl: string;
  description: string;
  model: string;
  systemPrompt: string;
  instructions: string;
};

type UpdateCharacterDialogProps = {
  character: Doc<"characters">;
};

function slugifyUniqueName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

function getInitialValues(character: Doc<"characters">): FormValues {
  return {
    name: character.name ?? "",
    uniqueName: character.uniqueName ?? "",
    avatarUrl: character.avatarUrl ?? "",
    description: character.description ?? "",
    model: character.model ?? "",
    systemPrompt: character.systemPrompt ?? "",
    instructions: character.instructions ?? "",
  };
}

function shouldUniqueNameStayDirty(values: FormValues) {
  if (!values.uniqueName.trim()) {
    return false;
  }

  return values.uniqueName.trim() !== slugifyUniqueName(values.name);
}

type InputElement = HTMLInputElement | HTMLTextAreaElement;

export function UpdateCharacterDialog({
  character,
}: UpdateCharacterDialogProps) {
  const updateCharacter = useMutation(api.characters.updateCharacter);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(() =>
    getInitialValues(character),
  );
  const [uniqueNameDirty, setUniqueNameDirty] = useState(() =>
    shouldUniqueNameStayDirty(getInitialValues(character)),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    const nextValues = getInitialValues(character);
    setFormValues(nextValues);
    setUniqueNameDirty(shouldUniqueNameStayDirty(nextValues));
    setError(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      resetForm();
    } else {
      setError(null);
      setIsSubmitting(false);
    }
  };

  const handleFieldChange =
    (field: keyof FormValues) => (event: ChangeEvent<InputElement>) => {
      const value = event.target.value;

      setFormValues((previous) => {
        if (field === "name" && !uniqueNameDirty) {
          const nextUniqueName = slugifyUniqueName(value);
          return {
            ...previous,
            name: value,
            uniqueName: nextUniqueName,
          };
        }

        return {
          ...previous,
          [field]: value,
        };
      });

      if (field === "uniqueName") {
        setUniqueNameDirty(value.trim().length > 0);
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: formValues.name.trim(),
      uniqueName: formValues.uniqueName.trim(),
      avatarUrl: formValues.avatarUrl.trim(),
      description: formValues.description.trim(),
      model: formValues.model.trim(),
      systemPrompt: formValues.systemPrompt.trim(),
      instructions: formValues.instructions.trim(),
    };

    try {
      await updateCharacter({
        id: character._id,
        character: {
          ...payload,
        },
      });

      handleOpenChange(false);
    } catch (submitError) {
      console.error(submitError);
      setError(
        "Something went wrong while updating the character. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon className="size-4" />
          <span className="sr-only">Edit character</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit character</DialogTitle>
          <DialogDescription>
            Update how this AI persona looks, speaks, and behaves.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[520px] overflow-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label
                  htmlFor="edit-character-name"
                  className="text-sm font-medium"
                >
                  Display name
                </label>
                <Input
                  id="edit-character-name"
                  value={formValues.name}
                  onChange={handleFieldChange("name")}
                  placeholder="Sophia the Strategist"
                  required
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-character-unique-name"
                  className="text-sm font-medium"
                >
                  Unique handle
                </label>
                <div className="relative">
                  <span className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 text-sm">
                    @
                  </span>
                  <Input
                    id="edit-character-unique-name"
                    value={formValues.uniqueName}
                    onChange={handleFieldChange("uniqueName")}
                    placeholder="sophia-strategist"
                    required
                    disabled={isSubmitting}
                    autoComplete="off"
                    className="ps-7"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-character-avatar-url"
                  className="text-sm font-medium"
                >
                  Avatar URL
                </label>
                <Input
                  id="edit-character-avatar-url"
                  type="url"
                  value={formValues.avatarUrl}
                  onChange={handleFieldChange("avatarUrl")}
                  placeholder="https://example.com/avatar.png"
                  required
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="edit-character-model"
                  className="text-sm font-medium"
                >
                  Model
                </label>
                <Input
                  id="edit-character-model"
                  value={formValues.model}
                  onChange={handleFieldChange("model")}
                  placeholder="gpt-4o-mini"
                  required
                  disabled={isSubmitting}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="edit-character-description"
                className="text-sm font-medium"
              >
                Short description
              </label>
              <Textarea
                id="edit-character-description"
                value={formValues.description}
                onChange={handleFieldChange("description")}
                placeholder="A tactically minded AI guide who excels at breaking down complex decisions."
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="edit-character-system-prompt"
                className="text-sm font-medium"
              >
                System prompt
              </label>
              <Textarea
                id="edit-character-system-prompt"
                value={formValues.systemPrompt}
                onChange={handleFieldChange("systemPrompt")}
                placeholder="You are Sophia, an AI strategist who thinks three moves ahead and communicates with clarity and warmth."
                disabled={isSubmitting}
                rows={4}
              />
            </div>
            {/* 
            <div className="grid gap-2">
              <label
                htmlFor="edit-character-instructions"
                className="text-sm font-medium"
              >
                Response instructions
              </label>
              <Textarea
                id="edit-character-instructions"
                value={formValues.instructions}
                onChange={handleFieldChange("instructions")}
                placeholder="Stay concise, offer two actionable options, and close with a motivational insight."
                disabled={isSubmitting}
                rows={4}
              />
            </div> */}

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
