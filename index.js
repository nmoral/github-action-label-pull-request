import core from "@actions/core";
import github from "@actions/github";
import {run} from "./src/main.js";

try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const {
        number,
        repository: { owner, name },
    } = github.context.payload;

    run(number, name, owner);

} catch (error) {
    core.setFailed(error.message);
}
