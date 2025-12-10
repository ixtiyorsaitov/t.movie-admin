import { createMemberAction } from "./create";
import { deleteMemberAction } from "./delete";
import { getMembersAction } from "./get";
import { updateMemberAction } from "./update";

export const MembersAction = {
  getAll: getMembersAction,
  create: createMemberAction,
  update: updateMemberAction,
  delete: deleteMemberAction,
};
