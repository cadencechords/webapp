import React from "react";
import Button from "./Button";
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
      <div className="flex-center mb-8">
        <WelcomeChecklist />
      </div>
      <h3 className="font-semibold text-xl">
        Ready to try it for real?{" "}
        <a
          href="https://www.app.cadencechords.com/signup"
          className="underline text-blue-600"
        >
          Sign me up!
        </a>
      </h3>
    </>
  );
}
