"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, SquarePlus, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "standalone" | "ios" | "other";

function detect(): Platform {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (standalone) return "standalone";
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "other";
}

const noop = () => () => {};

export function InstallApp() {
  const platform = useSyncExternalStore<Platform | null>(noop, detect, () => null);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (platform === null || platform === "standalone" || installed) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Smartphone className="size-6" />
      </div>
      <div className="flex-1 space-y-1">
        <h3 className="font-heading text-lg font-bold">Install RepWise on your phone</h3>
        {platform === "ios" ? (
          <p className="text-sm text-muted-foreground">
            In Safari, tap <Share className="inline size-4 align-text-bottom" /> <b>Share</b>, then{" "}
            <SquarePlus className="inline size-4 align-text-bottom" /> <b>Add to Home Screen</b>. It opens full-screen
            like an app and works offline in the gym.
          </p>
        ) : deferred ? (
          <p className="text-sm text-muted-foreground">
            One tap to add it to your home screen. Opens full-screen and works offline.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Open your browser menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>. It works offline once
            installed.
          </p>
        )}
      </div>
      {deferred && (
        <Button
          size="lg"
          className="h-11 px-5"
          onClick={async () => {
            await deferred.prompt();
            const { outcome } = await deferred.userChoice;
            if (outcome === "accepted") setInstalled(true);
            setDeferred(null);
          }}
        >
          <Download /> Install
        </Button>
      )}
    </div>
  );
}
