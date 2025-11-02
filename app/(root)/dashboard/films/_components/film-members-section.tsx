import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSearchedUsers } from "@/hooks/useUsers";
import { IUser, ROLE } from "@/types";
import React, { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

interface Props {
  selectedActors: string[];
  setSelectedActors: Dispatch<SetStateAction<string[]>>;
  selectedTranslators: string[];
  setSelectedTranslators: Dispatch<SetStateAction<string[]>>;
}

const FilmMembersSection = ({
  selectedActors,
  selectedTranslators,
  setSelectedActors,
  setSelectedTranslators,
}: Props) => {
  const { data: membersQuery } = useGetSearchedUsers({
    searchTerm: "",
    page: 1,
    limit: 100,
    roleFilter: ROLE.MEMBER,
  });

  const handleActorSelect = (memberId: string) => {
    if (!selectedActors.includes(memberId)) {
      setSelectedActors([...selectedActors, memberId]);
    }
  };

  const handleTranslatorSelect = (memberId: string) => {
    if (!selectedTranslators.includes(memberId)) {
      setSelectedTranslators([...selectedTranslators, memberId]);
    }
  };

  const removeActor = (memberId: string) => {
    setSelectedActors(selectedActors.filter((id) => id !== memberId));
  };

  const removeTranslator = (memberId: string) => {
    setSelectedTranslators(selectedTranslators.filter((id) => id !== memberId));
  };

  const getSelectedMembers = (ids: string[]) => {
    return (
      membersQuery?.datas.filter((member: IUser) => ids.includes(member._id)) ||
      []
    );
  };

  const getAvailableMembers = (selectedIds: string[]) => {
    return (
      membersQuery?.datas.filter(
        (member: IUser) => !selectedIds.includes(member._id)
      ) || []
    );
  };

  return (
    <div className="space-y-6">
      {/* Ovoz aktyorlari */}
      <div>
        <p className="font-semibold mb-3 text-sm dark:text-gray-200">
          Ovoz aktyorlari
        </p>
        <Select onValueChange={handleActorSelect}>
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <SelectValue placeholder="Ovoz aktyorini tanlang">
              {selectedActors.length > 0 && (
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedActors.length} ta tanlandi
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectGroup>
              {getAvailableMembers(selectedActors).map((member: IUser) => (
                <SelectItem
                  value={member._id}
                  key={member._id}
                  className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm dark:text-gray-200">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Selected Actors */}
        {selectedActors.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {getSelectedMembers(selectedActors).map((member: IUser) => (
              <div
                key={member._id}
                className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2 group hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs overflow-hidden">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {member.name}
                </span>
                <button
                  onClick={() => removeActor(member._id)}
                  className="ml-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tarjimonlar */}
      <div>
        <p className="font-semibold mb-3 text-sm dark:text-gray-200">
          Tarjimonlar
        </p>
        <Select onValueChange={handleTranslatorSelect}>
          <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
            <SelectValue placeholder="Tarjimonni tanlang">
              {selectedTranslators.length > 0 && (
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedTranslators.length} ta tanlandi
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectGroup>
              {getAvailableMembers(selectedTranslators).map((member: IUser) => (
                <SelectItem
                  value={member._id}
                  key={member._id}
                  className="dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm dark:text-gray-200">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Selected Translators */}
        {selectedTranslators.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {getSelectedMembers(selectedTranslators).map((member: IUser) => (
              <div
                key={member._id}
                className="flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 group hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-medium text-xs overflow-hidden">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {member.name}
                </span>
                <button
                  onClick={() => removeTranslator(member._id)}
                  className="ml-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmMembersSection;
