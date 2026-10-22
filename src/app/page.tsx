"use client";

import Container from "@/components/3d/Container";
import { CardForm } from "@/components/CardForm";
import { Heading } from "@/components/Heading";
import { Modal } from "@/components/Modal";
import { Visualizer } from "@/components/Visualizer";
import { WelcomeModal } from "@/components/WelcomeModal";
import { hasSeenWelcome, markWelcomeSeen } from "@/components/welcomeCookie";
import { FormStateHydrator } from "@/store/FormStateHydrator";
import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  // Cookies are only readable client-side: show the welcome modal on a
  // first visit (no cookie yet) once mounted.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads an external (cookie) value after mount
    if (!hasSeenWelcome()) setWelcomeOpen(true);
  }, []);

  function closeWelcome() {
    markWelcomeSeen();
    setWelcomeOpen(false);
  }

  return (
    <div>
      <FormStateHydrator />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        transition={Slide}
        toastStyle={{ padding: 0, background: "transparent", width: "auto" }}
        newestOnTop={false}
        rtl={false}
        closeButton={false}
        closeOnClick
        hideProgressBar
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <main className="bg-base-100 mx-auto flex w-full max-w-[1600px] md:max-h-[100svh] flex-1 flex-col gap-6 xl:px-8 lg:px-6 py-6 lg:h-screen px-4">
        <Heading
          onSettingsClick={() => setSettingsOpen(true)}
          onWelcomeClick={() => setWelcomeOpen(true)}
        />
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <CardForm className="min-h-0 md:overflow-y-auto" />
          <Visualizer>
            <Container />
          </Visualizer>
        </div>
      </main>
      {settingsOpen && (
        <Modal
          onLanguageChange={() => {}}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {welcomeOpen && <WelcomeModal onClose={closeWelcome} />}
    </div>
  );
}
