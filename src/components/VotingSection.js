import { useState } from "react";
import { useParams } from "../util/router";
import { useGetSessionById, useGetUserById } from "../util/db";
import { useAuth } from "../util/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ participant, reveal, hasVoted }) {
  const auth = useAuth();
  const { data, isLoading, status } = useGetUserById(participant.id);

  if (isLoading) {
    return <li>Loading user...</li>;
  }

  if (status === "error" || !data) {
    return <li>Error loading user data.</li>;
  }

  const bgColor =
    !reveal && participant.number ? "bg-emerald-500" : "bg-gray-200";

  return (
    <li
      key={data.name}
      className="col-span-1 flex h-16 sm:h-12 rounded-md shadow-sm"
    >
      <div
        className={classNames(
          bgColor,
          "flex w-16 sm:w-20 flex-shrink-0 items-center justify-center rounded-l-md text-2xl sm:text-xl font-medium text-white"
        )}
      >
        {reveal || auth.user.id === participant.id ? participant.number : "?"}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base">
          <a
            href={data.href}
            className="font-medium text-gray-900 hover:text-gray-600"
          >
            {data.name}
          </a>
        </div>
      </div>
    </li>
  );
}

export default function VotingSection() {
  const { id } = useParams();
  const { data, isLoading, status } = useGetSessionById(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "error" || !data) {
    return <div>Failed to fetch the session data!</div>;
  }

  return (
    <>
      <ul className="mt-3 grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {data.participants.map((participant, index) => {
          if (!participant.observer) {
            return (
              <Card
                key={index}
                participant={participant}
                reveal={data.reveal}
                hasVoted={participant.voted} // Assuming each participant object has a `voted` attribute
              />
            );
          }
        })}
      </ul>
    </>
  );
}
