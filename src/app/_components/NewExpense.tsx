import { IconPlus } from "@tabler/icons-react";

export default function NewExpense() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col justify-center gap-x-5 gap-y-2 p-4 sm:flex-row">
      <button className="flex items-center justify-center gap-1 rounded-xl bg-blue-200 px-4 py-2 font-semibold text-blue-500 transition-colors hover:bg-blue-300">
        <IconPlus size={18} stroke={3} />
        <span className="text-sm">Add Funds</span>
      </button>
      <button className="flex items-center justify-center gap-1 rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
        <IconPlus size={18} stroke={3} />
        <span className="text-sm">New Expense</span>
      </button>
    </div>
  );
}
