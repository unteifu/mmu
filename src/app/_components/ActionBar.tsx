"use client";

import NiceModal from "@ebay/nice-modal-react";
import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconPlus,
} from "@tabler/icons-react";
import AddIncomeModal from "./AddIncomeModal";

export default function ActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-col justify-center gap-x-5 gap-y-2 p-4 sm:flex-row">
      <button
        onClick={() => NiceModal.show(AddIncomeModal)}
        className="flex items-center justify-center gap-1 rounded-xl bg-blue-200 px-4 py-2 font-semibold text-blue-500 transition-colors hover:bg-blue-300"
      >
        <IconArrowNarrowDown size={18} stroke={3} />
        <span className="text-sm">Add Income</span>
      </button>
      <button className="flex items-center justify-center gap-1 rounded-xl bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
        <IconArrowNarrowUp size={18} stroke={3} />
        <span className="text-sm">Add Expense</span>
      </button>
    </div>
  );
}
