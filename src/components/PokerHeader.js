import { CalendarIcon } from "@heroicons/react/20/solid";
import { UsersIcon } from "@heroicons/react/24/solid";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import {
  resetRevealAndNumbers,
  toggleObserverStatus,
  updateRevealStatus,
  useGetSessionById,
} from "../util/db";
import { useAuth } from "../util/auth";
import { Dialog } from "@headlessui/react";

export default function PokerHeader() {
  const { id } = useParams();
  const auth = useAuth();
  const data = useGetSessionById(id);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const sessionDate = useMemo(() => {
    if (data?.data?.createdAt) {
      const date = new Date(data.data.createdAt.seconds * 1000);
      return date.toLocaleDateString();
    }
    return null;
  }, [data]);

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  const confirmReset = () => {
    resetRevealAndNumbers(id);
    closeConfirm();
  };

  const sendAlertToVote = () => {
    alert("Please vote now!");

    window.focus();
  };

  return (
    <div className="lg:flex lg:items-center lg:justify-between pt-5">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {data?.data?.sessionName || "Loading..."}
        </h2>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <UsersIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            {data?.data?.participants.length || 0} Participants
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Created on {sessionDate}
          </div>
        </div>
      </div>

      <div className="mt-5 flex space-x-3 lg:space-x-4">
        <button
          onClick={sendAlertToVote}
          type="button"
          className="inline-flex items-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
        >
          Alert
        </button>
        <button
          onClick={() => {
            toggleObserverStatus(id, auth.user.id);
          }}
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Observe
        </button>
        <button
          onClick={() => setIsConfirmOpen(true)}
          type="button"
          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          onClick={() => {
            updateRevealStatus(id, true);
          }}
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Reveal
        </button>

        {/* Confirmation Dialog */}
        <Dialog
          open={isConfirmOpen}
          onClose={closeConfirm}
          as="div"
          className="fixed inset-0 flex items-center justify-center"
        >
          <Dialog.Overlay
            as="div"
            className="fixed inset-0 bg-black opacity-40"
          />
          <div className="bg-white p-6 rounded-md max-w-sm border z-10 mx-auto">
            <Dialog.Title as="h2" className="text-xl font-semibold mb-4">
              Are you sure?
            </Dialog.Title>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
