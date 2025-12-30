import React, { useEffect, useRef, useState } from "react";

type ClickOutsideHook = {
  ref: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const useClickOutside = (initialState: boolean = false): ClickOutsideHook => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  const ref = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <ClickOutsideHook>{ref, isOpen, setIsOpen};
};

export default useClickOutside;