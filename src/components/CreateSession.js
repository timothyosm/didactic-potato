import { useState } from "react";
import { createSession } from "../util/db";
import { useAuth } from "../util/auth";
import { useHistory } from "../util/router";

export default function CreateSession() {
  const [sessionName, setSessionName] = useState("");
  const auth = useAuth();

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await createSession({
      sessionName: sessionName,
      reveal: false,
      participants: [
        {
          id: auth.user.id,
          number: 0,
          bgColor: "bg-red-600",
          observer: false,
        },
      ],
    });

    if (response && response.id) {
      history.push(`/poker/${response.id}`);
    }

    setSessionName("");
  };
  return (
    <div className="bg-indigo-700 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:col-span-7">
          <h2 className="inline sm:block lg:inline xl:block">
            Ready to plan your next sprint?
          </h2>{" "}
          <p className="inline sm:block lg:inline xl:block">
            Start a new poker planning session.
          </p>
        </div>
        <form
          className="w-full max-w-md lg:col-span-5 lg:pt-2"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-x-4">
            <label htmlFor="session-name" className="sr-only">
              Session Name
            </label>
            <input
              id="session-name"
              name="session"
              type="text"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-white/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white/75 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)} // Update the state when the input changes.
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start Session
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            Make sure to invite your team. See our{" "}
            <a
              href="#"
              className="font-semibold text-white hover:text-indigo-50"
            >
              guidelines
            </a>{" "}
            for a successful session.
          </p>
        </form>
      </div>
    </div>
  );
}
