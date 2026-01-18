import { useState } from "react";
import type { Route } from "./+types/setup";
import amplitude from "../../../public/AMPLITUDE_FULL_BLUE.svg";
import github from "../../../public/Github.svg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agent Setup - Frictionless" },
    { name: "description", content: "Configure your Frictionless agent" },
  ];
}

export default function AgentSetup() {
  const [amplitudeKey, setAmplitudeKey] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  const handleGenerate = () => {
    if (!amplitudeKey) return;
    const key = `fl_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedKey(key);
  };

  return (
    <div className="max-w-md space-y-8">
      <div>
        <h2 className="text-lg font-medium">Connect your services</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <img src={amplitude} alt="Amplitude" className="h-20" />
            API Key
          </label>
          <input
            type="text"
            value={amplitudeKey}
            onChange={(e) => setAmplitudeKey(e.target.value)}
            placeholder="amp_xxxxxxxx"
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mypage))] focus:border-transparent"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <img src={github} alt="GitHub" className="h-20 dark:invert" />
            Access Token
            <span className="text-xs opacity-60">optional</span>
          </label>
          <input
            type="text"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="ghp_xxxxxxxx"
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mypage))] focus:border-transparent"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!amplitudeKey}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-[hsl(var(--mypage))] rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          Generate API Key
        </button>
      </div>

      {generatedKey && (
        <div className="space-y-2 pt-4 border-t">
          <label className="text-sm text-muted-foreground">Your API Key</label>
          <div className="flex gap-2">
            <code className="flex-1 px-3 py-2 text-sm bg-muted rounded-md font-mono truncate">
              {generatedKey}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(generatedKey)}
              className="px-3 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
