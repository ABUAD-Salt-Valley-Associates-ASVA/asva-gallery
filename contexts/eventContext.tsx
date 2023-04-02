import { createContext, useContext, useState } from "react";

type EventContextData = {
  folder: string;
  setFolder: (folder: string) => void;
};

type EventProviderProps = {
  children: React.ReactNode;
};

export const eventContext = createContext({
  folder: "epic22",
  setFolder: (folder: string) => {
    console.log("setFolder", folder);
  },
} as EventContextData);

export function EventProvider({ children }: EventProviderProps) {
  const [folder, setFolder] = useState("epic22");

  return (
    <eventContext.Provider value={{ folder, setFolder }}>
      {children}
    </eventContext.Provider>
  );
}
