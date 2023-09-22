import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useAuth } from "../util/auth";
import { updateParticipantNumber, useGetSessionById } from "../util/db";

function FibonacciButtons() {
  const { id } = useParams();
  const auth = useAuth();
  const { data, status, isLoading } = useGetSessionById(id);

  const fibNumbers = [0, 0.5, 1, 2, 3, 5, 8, "?", "∞", "☕"];

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message or spinner
  }

  if (status === "error") {
    return <div>Error fetching data. Please try again.</div>; // Handle error status
  }

  return (
    <div className="flex justify-center items-end">
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-10 p-4">
        {fibNumbers.map((num, index) => (
          <button
            disabled={data?.reveal}
            onClick={() => {
              updateParticipantNumber(id, auth.user.id, num);
            }}
            key={index}
            className={`text-sm sm:text-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded 
              ${
                data?.reveal
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-800"
              }
              text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo 
              ${
                !data?.reveal &&
                "transform hover:-translate-y-1 transition duration-150 ease-in-out"
              }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FibonacciButtons;
