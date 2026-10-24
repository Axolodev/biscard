import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { version } from "../package.json";

try {
  LogRocket.init("bsnicv/g3co", { release: version });
  setupLogRocketReact();
} catch (error) {
  console.error("LogRocket failed to initialize", error);
}
