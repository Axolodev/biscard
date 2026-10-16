"use client";

import { useState } from "react";
import { CardForm } from "@/components/CardForm";
import { initialCardFormState } from "@/components/cardFormTypes";
import type { CardFormState } from "@/components/cardFormTypes";
import { Heading } from "@/components/Heading";
import { Modal } from "@/components/Modal";
import { Visualizer } from "@/components/Visualizer";

export default function Home() {
  const [form, setForm] = useState<CardFormState>(initialCardFormState);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="bg-base-100 mx-auto flex w-full max-w-[1920px] flex-1 flex-col gap-6 px-8 py-6 lg:h-screen lg:px-[120px]">
      <Heading onSettingsClick={() => setSettingsOpen(true)} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <CardForm
          state={form}
          onChange={setForm}
          className="min-h-0 lg:overflow-y-auto"
        />
        <Visualizer onResetView={() => {}} onDownloadStl={() => {}} />
      </div>
      {settingsOpen && (
        <Modal
          onLanguageChange={() => {}}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  );
}
