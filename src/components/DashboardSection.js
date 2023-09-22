import React from "react";
import DashboardItems from "./DashboardItems";
import { Link } from "./../util/router";
import { useAuth } from "./../util/auth";
import PlanningPokerSessions from "./PlanningPokerSessions";

function DashboardSection(props) {
  const auth = useAuth();

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="p-4 w-full md:w-1/2">
            <PlanningPokerSessions />
          </div>
          <div className="p-4 w-full md:w-1/2">
            <div className="p-6 rounded border border-gray-200 prose prose-a:text-blue-600 max-w-none">
              <h3 className="mb-4">What is Planning Poker?</h3>
              <p>
                Planning Poker is an agile estimating technique used by teams to
                determine the effort required for different tasks or user
                stories. Participants use specially numbered cards to vote on
                the size or complexity of a task, promoting discussion and
                arriving at a consensus.
              </p>
              <p>
                It's a fun, collaborative way to achieve accurate estimates
                without allowing any one person to dominate the discussion.
                Plus, it can help uncover unknowns and potential challenges
                early in the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardSection;
