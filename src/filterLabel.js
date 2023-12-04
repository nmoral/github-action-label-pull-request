import core from "@actions/core";


export function filterLabel(labels) {
    const excludedLabels = (core.getInput("excluded-labels") || '').split(',');
    core.debug(excludedLabels);
    labels = labels.filter(function ({name}) {
        core.debug(name);
        core.debug(excludedLabels.includes(name))

        return !excludedLabels.includes(name)
    });

    labels = labels.map(({id}) => id);
    core.debug(labels);

    return labels;
}
