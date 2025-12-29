import { useEffect, useRef } from "react";

const worker = useRef<Worker | null>(null);

useEffect(() => {
  if (!worker.current) {
    worker.current = new Worker(new URL("./random.worker.ts", import.meta.url));
  }
  return () => {};
}, []);
