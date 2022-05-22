import React from "react";
import PageTitle from "./PageTitle";
import WelcomeChecklist from "./WelcomeChecklist";

export default function Welcome() {
  return (
    <>
      <PageTitle
        title="Welcome to Cadence! 🎉"
        className="text-4xl mt-8 mb-4"
      />
      <p className="leading-7 text-base">
        This playground was designed to allow you to test out some of Cadence's
        features without signing up for an account. If you're not sure where to
        start, take a look at the checklist below for some ideas. Any songs or
        data you create will be saved to your browser and not sent to our
        servers.
      </p>
      <div className="flex-center">
        <WelcomeChecklist />
      </div>
    </>
  );
}
