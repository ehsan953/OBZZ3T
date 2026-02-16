import { useState } from "#imports";

type FlashType = "success" | "error";

export const useFlashMessage = () => {
  const message = useState<string | null>("flash:message", () => null);
  const type = useState<FlashType | null>("flash:type", () => null);

  const setSuccess = (msg: string) => {
    message.value = msg;
    type.value = "success";
  };

  const setError = (msg: string) => {
    message.value = msg;
    type.value = "error";
  };

  const clear = () => {
    message.value = null;
    type.value = null;
  };

  return {
    message,
    type,
    setSuccess,
    setError,
    clear,
  };
};

