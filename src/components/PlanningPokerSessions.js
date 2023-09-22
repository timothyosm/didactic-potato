import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment, useMemo } from "react";
import { useAuth } from "../util/auth";
import { useGetSessionsForUser } from "../util/db";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PlanningPokerSessions() {
  const auth = useAuth();
  const { data, isLoading, status } = useGetSessionsForUser(auth.user.id);

  const sessionDate = useMemo(() => {
    if (data?.createdAt) {
      const date = new Date(data.createdAt.seconds * 1000);
      return date.toLocaleDateString();
    }
    return null;
  }, [data]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error fetching sessions</div>;
  }

  return (
    <div className="border rounded-md border-gray-200 bg-white px-4 py-5 sm:px-6">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Sessions
        </h3>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {data &&
          data.map((session) => (
            <li key={session.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {session.sessionName}
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    Created: {sessionDate}
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-500">
                    Participants: {session.participants.length}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                {/* Join Button */}
                <a
                  href={`/poker/${session.id}`}
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Join
                </a>

                {/* Options Menu */}
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            View session
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? "bg-gray-50" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900"
                            )}
                          >
                            Edit session
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
