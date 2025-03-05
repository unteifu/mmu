import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { IconX } from "@tabler/icons-react";
import { Dialog } from "radix-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner";

const schema = z.object({
  amount: z
    .number()
    .positive()
    .refine(
      (n) => {
        const parts = n.toString().split(".");
        return parts.length === 1 || (parts[1] && parts[1].length <= 2);
      },
      { message: "Max precision is 2 decimal places" },
    ),
});
type Schema = z.infer<typeof schema>;

export default NiceModal.create(() => {
  const modal = useModal();
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const utils = api.useUtils();
  const addIncome = api.portfolio.addIncome.useMutation({
    onSuccess: async () => {
      await utils.portfolio.invalidate();
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await addIncome.mutateAsync(data);
    void modal.remove();
  };

  return (
    <Dialog.Root open={modal.visible} onOpenChange={modal.hide}>
      <AnimatePresence>
        {modal.visible && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-neutral-500/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <div className="fixed bottom-0 left-1/2 w-full max-w-xl -translate-x-1/2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
                <motion.div
                  className="mx-4 rounded-t-xl bg-white p-8 sm:rounded-b-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="flex w-full justify-between">
                    <Dialog.Title className="text-2xl font-semibold">
                      Add Income
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="flex h-fit text-neutral-400 outline-none transition-colors hover:text-neutral-700 focus:outline-none"
                        aria-label="Close"
                      >
                        <IconX size={18} stroke={3} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="text-sm font-medium text-neutral-500">
                    Increase your balance by adding income to your account
                  </Dialog.Description>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 flex flex-col gap-4"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        £
                      </span>
                      <input
                        className="w-full rounded-xl border-2 border-neutral-200 p-2 pl-7 outline-none [appearance:textfield] focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        type="text"
                        inputMode="decimal"
                        {...register("amount", {
                          required: true,
                          valueAsNumber: true,
                        })}
                        autoFocus
                        onInput={(e) => {
                          let value = e.currentTarget.value;

                          value = value.replace(/[^0-9.]/g, "");

                          const parts = value.split(".");
                          if (parts.length > 2) {
                            value = parts[0] + "." + parts.slice(1).join("");
                          }

                          if (parts[1] && parts[1].length > 2) {
                            value = parts[0] + "." + parts[1].substring(0, 2);
                          }

                          e.currentTarget.value = value;
                        }}
                      />
                    </div>
                    <button
                      className={classNames(
                        "w-full rounded-xl py-2 transition-colors",
                        {
                          "bg-blue-500 hover:bg-blue-600": isValid,
                          "bg-blue-200": !isValid,
                        },
                      )}
                      type="submit"
                      disabled={!isValid}
                    >
                      <div className="group flex items-center justify-center text-white">
                        {isSubmitting ? (
                          <Spinner size={20} />
                        ) : (
                          <span className="text-sm font-semibold">
                            Add Income
                          </span>
                        )}
                      </div>
                    </button>
                  </form>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});
