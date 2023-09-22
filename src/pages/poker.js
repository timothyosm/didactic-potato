import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import FibonacciButtons from "../components/FibonacciButtons";
import PokerHeader from "../components/PokerHeader";
import VotingSection from "../components/VotingSection";
import { useAuth } from "../util/auth";
import { addParticipantToSession, useGetSessionById } from "../util/db";
import Meta from "./../components/Meta";

function Poker(props) {
  const { id } = useParams();
  const auth = useAuth();
  const { data } = useGetSessionById(id);

  useEffect(() => {
    if (data && auth.user) {
      if (
        !data.participants.some(
          (participant) => participant.id === auth.user.id
        )
      ) {
        addParticipantToSession(id, {
          id: auth.user.id,
          bgColor: "bg-red-600",
          observer: false,
          number: 0,
        });
      }
    }
  }, [data, auth.user, id]);

  return (
    <>
      <Meta
        title="Planning Poker"
        description="Learn about our company and team"
      />
      <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white">
          <div className="px-4 py-5 sm:px-6">
            <PokerHeader />
          </div>
          <div className="px-4 py-5 sm:p-6">
            <VotingSection />
          </div>
          <div className="px-4 py-4 sm:px-6">
            <FibonacciButtons />
          </div>
        </div>
      </div>
    </>
  );
}

export default Poker;
