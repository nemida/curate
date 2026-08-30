"use client";

import { useState, useTransition } from "react";
import { generateAPIToken } from "../actions/users";
import { Button } from "@/components/ui/button";

export default function TokenSectionClient({ initialToken }: { initialToken: string | null }) {
  const [token, setToken] = useState(initialToken);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const newToken = await generateAPIToken();
      if (newToken) {
        setToken(newToken);
      }
    });
  };

  return (
    <div data-testid="api-token-section" className="border-t pt-4 flex flex-col gap-3">
      <p className="text-sm font-medium">API Token</p>
      {token ? (
        <div data-testid="token-display">
          <code data-testid="api-token" className="text-sm font-mono bg-muted px-3 py-2 rounded-md break-all block">
            {token}
          </code>
        </div>
      ) : (
        <p data-testid="no-token-message" className="text-sm text-muted-foreground">
          No token generated yet.
        </p>
      )}
      <div>
        <Button
          data-testid="generate-token-button"
          onClick={handleGenerate}
          disabled={isPending}
          variant="outline"
          size="sm"
        >
          {token ? "Regenerate token" : "Generate token"}
        </Button>
      </div>
    </div>
  );
}
