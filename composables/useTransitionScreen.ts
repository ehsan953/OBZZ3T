import { useRouter, useState } from "#imports";

export const useTransitionScreen = () => {
  const router = useRouter();

  // Shared state across layout/pages
  const show = useState<boolean>("transition:show", () => false);
  const target = useState<string>("transition:target", () => "/");

  const startTransition = (path: string) => {
    target.value = path;
    show.value = true;
    router.push(path);
  };

  const completeTransition = () => {
    show.value = false;
  };

  return {
    show,
    target,
    startTransition,
    completeTransition,
  };
};

