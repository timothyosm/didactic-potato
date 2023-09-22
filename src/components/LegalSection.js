import React from "react";
import { Link } from "./../util/router";
import LegalTerms from "./LegalTerms";
import LegalPrivacy from "./LegalPrivacy";

function LegalSection(props) {
  const validSections = {
    "terms-of-service": true,
    "privacy-policy": true,
  };

  const section = validSections[props.section]
    ? props.section
    : "terms-of-service";

  const data = {
    domain: "company.com",
    companyName: "Company",
  };

  return (
    <section className="py-10 px-4">
      <div className="flex justify-center space-x-5">
        <Link
          to="/legal/terms-of-service"
          className={"" + (section === "terms-of-service" ? " underline" : "")}
        >
          Terms of Service
        </Link>
        <Link
          to="/legal/privacy-policy"
          className={"" + (section === "privacy-policy" ? " underline" : "")}
        >
          Privacy Policy
        </Link>
      </div>
      <div className="container mx-auto mt-12">
        {section === "terms-of-service" && <LegalTerms {...data} />}

        {section === "privacy-policy" && <LegalPrivacy {...data} />}
      </div>
    </section>
  );
}

export default LegalSection;
