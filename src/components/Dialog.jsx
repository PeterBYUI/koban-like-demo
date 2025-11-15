import { useImperativeHandle, useRef } from "react";

export default function Dialog({ ref, children }) {
  const internalRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        internalRef.current.showModal();
      },
      close() {
        internalRef.current.close();
      },
    };
  });

  return (
    <dialog
      ref={internalRef}
      className="bg-[#e6e6fa] mt-16 w-2/3 lg:w-1/3 mx-auto p-8 rounded-md backdrop:bg-slate-950 backdrop:opacity-25"
    >
      {children}
    </dialog>
  );
}
