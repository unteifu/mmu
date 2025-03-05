import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  IconCar,
  IconCircleCheck,
  IconCircles,
  IconHeart,
  IconInvoice,
  IconMovie,
  IconShoppingBag,
  IconSoup,
  IconX,
} from "@tabler/icons-react";
import { Dialog } from "radix-ui";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "./Spinner";
import toast from "react-hot-toast";

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
  category: z.enum([
    "FOOD",
    "TRANSPORT",
    "SHOPPING",
    "BILLS",
    "ENTERTAINMENT",
    "HEALTH",
    "OTHER",
  ]),
});
type Schema = z.infer<typeof schema>;

function Badge({ type }: { type: Schema["category"] }) {
  const colors = {
    FOOD: {
      backgroundColor: "bg-red-200",
      textColor: "text-red-700",
      icon: <IconSoup size={20} stroke={2.5} />,
    },
    TRANSPORT: {
      backgroundColor: "bg-cyan-200",
      textColor: "text-cyan-700",
      icon: <IconCar size={20} stroke={2.5} />,
    },
    SHOPPING: {
      backgroundColor: "bg-yellow-200",
      textColor: "text-yellow-700",
      icon: <IconShoppingBag size={20} stroke={2.5} />,
    },
    BILLS: {
      backgroundColor: "bg-green-200",
      textColor: "text-green-700",
      icon: <IconInvoice size={20} stroke={2.5} />,
    },
    ENTERTAINMENT: {
      backgroundColor: "bg-purple-200",
      textColor: "text-purple-700",
      icon: <IconMovie size={20} stroke={2.5} />,
    },
    HEALTH: {
      backgroundColor: "bg-pink-200",
      textColor: "text-pink-700",
      icon: <IconHeart size={20} stroke={2.5} />,
    },
    OTHER: {
      backgroundColor: "bg-gray-200",
      textColor: "text-gray-700",
      icon: <IconCircles size={20} stroke={2.5} />,
    },
  };

  return (
    <div
      className={classNames(
        "flex aspect-square items-center justify-center rounded-full p-1.5",
        colors[type].backgroundColor,
        colors[type].textColor,
      )}
    >
      {colors[type].icon}
    </div>
  );
}

export default NiceModal.create(() => {
  const modal = useModal();
  const categories: Schema["category"][] = [
    "FOOD",
    "TRANSPORT",
    "SHOPPING",
    "BILLS",
    "ENTERTAINMENT",
    "HEALTH",
    "OTHER",
  ];
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const selectedCategory = watch("category");
  const utils = api.useUtils();
  const addExpense = api.expenses.addExpense.useMutation({
    onSuccess: async () => {
      await utils.portfolio.invalidate();
      await utils.transactions.invalidate();
      toast.custom(
        (t) => (
          <AnimatePresence>
            {t.visible && (
              <motion.div
                key={t.id}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center gap-2 rounded-xl bg-green-100 px-3 py-1.5"
              >
                <IconCircleCheck size={20} className="text-green-500" />
                <span className="text-sm font-semibold text-green-500">
                  Expense added successfully
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        ),
        {
          duration: 1500,
        },
      );
      void modal.hide();
      setTimeout(() => {
        modal.remove();
      }, 100);
    },
  });

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await addExpense.mutateAsync(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      void modal.hide();
      setTimeout(() => {
        modal.remove();
      }, 100);
    }
  };

  return (
    <Dialog.Root open={modal.visible} onOpenChange={handleOpenChange}>
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
                      Add Expense
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
                    Add a new expense so you can keep track of your spending
                  </Dialog.Description>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-8 flex flex-col gap-4"
                  >
                    <div className="flex flex-wrap justify-center gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          className={classNames(
                            "flex items-center gap-2 rounded-xl p-2 transition-colors",
                            selectedCategory === category
                              ? "bg-blue-200 text-neutral-700"
                              : "bg-neutral-100 text-neutral-700",
                          )}
                          onClick={() => setValue("category", category)}
                          type="button"
                        >
                          <Badge type={category} />
                          <span className="text-sm font-semibold">
                            {category.toLowerCase()}
                          </span>
                        </button>
                      ))}
                    </div>
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
                        isValid
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-blue-200",
                      )}
                      type="submit"
                      disabled={!isValid}
                    >
                      <div className="group flex items-center justify-center text-white">
                        {isSubmitting ? (
                          <Spinner size={20} />
                        ) : (
                          <span className="text-sm font-semibold">
                            Add Expense
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
