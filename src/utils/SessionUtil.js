
// return 'unique' numeric id for use as user traverses stocktaking workflow.
export const makeWorkflowUid = () => Math.round(new Date().getTime() / 1000);
